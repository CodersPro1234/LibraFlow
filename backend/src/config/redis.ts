import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on('connect', () => logger.info('Redis connecté'));
redis.on('ready', () => logger.debug('Redis prêt'));
redis.on('error', (err: Error) => logger.error({ err }, 'Erreur Redis'));
redis.on('close', () => logger.warn('Connexion Redis fermée'));

export default redis;
