import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import * as Sentry from '@sentry/node';
import { env } from './config/env';
import redis from './config/redis';
import { supabaseAdmin } from './config/supabase';
import { globalLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import authRouter from './routes/auth.routes';
import universiteRouter from './routes/universite.routes';
import ministereRouter from './routes/ministere.routes';
import publicationsRouter from './routes/publications.routes';
import interactionsRouter from './routes/interactions.routes';
import feedRouter from './routes/feed.routes';
import meRouter from './routes/me.routes';
import notificationsRouter from './routes/notifications.routes';
import publicRouter from './routes/public.routes';
import syncRouter from './routes/sync.routes';
import { startModerationWorker } from './jobs/moderation.worker';
import { startTtsWorker } from './jobs/tts.worker';
import logger from './utils/logger';

// ── Sentry ────────────────────────────────────────────────────────────────────

if (env.sentryDsn) {
  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.nodeEnv,
    tracesSampleRate: env.nodeEnv === 'production' ? 0.1 : 1.0,
  });
}

const app = express();

// ── Sécurité & middlewares globaux ───────────────────────────────────────────

app.use(helmet());
app.use(
  cors({
    origin: [
      env.frontendUrl,
      ...(env.frontendStagingUrl ? [env.frontendStagingUrl] : []),
      ...(env.frontendProdUrl ? [env.frontendProdUrl] : []),
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting global ──────────────────────────────────────────────────────

app.use('/api/', globalLimiter);

// ── Swagger UI ────────────────────────────────────────────────────────────────

const openapiPath = path.resolve(process.cwd(), 'openapi.yaml');
if (fs.existsSync(openapiPath)) {
  const openapiDoc = YAML.parse(fs.readFileSync(openapiPath, 'utf8')) as Record<string, unknown>;
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc, {
    customSiteTitle: 'LibraFlow API Docs',
    swaggerOptions: { persistAuthorization: true },
  }));
}

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/health', async (_req, res) => {
  let dbConnected = false;
  let redisConnected = false;

  try {
    const { error } = await supabaseAdmin.from('ministere').select('id').limit(1);
    dbConnected = !error;
  } catch {
    dbConnected = false;
  }

  try {
    const pong = await redis.ping();
    redisConnected = pong === 'PONG';
  } catch {
    redisConnected = false;
  }

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    db_connected: dbConnected,
    redis_connected: redisConnected,
  });
});

// ── Routes API ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/universite', universiteRouter);
app.use('/api/v1/ministere', ministereRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/feed', feedRouter);
app.use('/api/v1/publications', publicationsRouter);
app.use('/api/v1/public', publicRouter);    // inclut /public/share/:token — avant interactionsRouter (pas d'auth)
app.use('/api/v1', interactionsRouter);     // /publications/:id/like|comments|save + /follow/... + /comments/:id
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/sync', syncRouter);
app.use('/api/v1/offline', syncRouter);     // /offline/feed-pack via syncRouter

// ── Error handler (doit être en dernier) ─────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  startModerationWorker();
  startTtsWorker();
  logger.info('Workers BullMQ démarrés (modération, TTS)');

  app.listen(env.port, () => {
    logger.info(
      { port: env.port, env: env.nodeEnv },
      'LibraFlow API démarrée'
    );
  });
}

if (require.main === module) {
  bootstrap().catch((err: unknown) => {
    logger.error({ err }, 'Échec critique au démarrage');
    process.exit(1);
  });
}

export default app;
