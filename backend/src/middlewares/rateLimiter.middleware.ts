import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis';

const redisStore = new RedisStore({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendCommand: (...args: string[]) => (redis as any).call(...(args as any)) as Promise<any>,
});

/** 100 requêtes/minute — appliqué globalement sur /api/ */
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  message: { error: { code: 'RATE_LIMIT', message: 'Trop de requêtes. Réessayez dans une minute.' } },
});

/** 5 requêtes/minute — login et refresh uniquement (anti brute-force) */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  message: { error: { code: 'RATE_LIMIT_AUTH', message: 'Trop de tentatives. Réessayez dans une minute.' } },
});

/** 20 requêtes/heure par utilisateur — endpoint /ask */
export const askLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  keyGenerator: (req) => {
    const user = (req as typeof req & { user?: { id: string } }).user;
    return user?.id ?? req.ip ?? 'anonymous';
  },
  message: { error: { code: 'RATE_LIMIT_ASK', message: 'Limite de 20 questions par heure atteinte.' } },
});
