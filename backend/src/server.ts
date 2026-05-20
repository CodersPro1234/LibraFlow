import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env';
import { supabaseAdmin } from './config/supabase';
import redis from './config/redis';
import { errorHandler } from './middlewares/errorHandler.middleware';
import authRouter from './routes/auth.routes';
import universiteRouter from './routes/universite.routes';
import ministereRouter from './routes/ministere.routes';
import logger from './utils/logger';

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

// ── Error handler (doit être en dernier) ─────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  app.listen(env.port, () => {
    logger.info(
      { port: env.port, env: env.nodeEnv },
      'LibraFlow API démarrée'
    );
  });
}

bootstrap().catch((err: unknown) => {
  logger.error({ err }, 'Échec critique au démarrage');
  process.exit(1);
});

export default app;
