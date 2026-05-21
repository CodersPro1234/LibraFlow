import { Queue } from 'bullmq';
import { redisBullMQ } from '../config/redis';

const connection = redisBullMQ;

export const moderationQueue = new Queue('moderation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const ttsQueue = new Queue('tts', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 10000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export interface ModerationJobData {
  publication_id: string;
  titre: string;
  matiere: string;
  texte_extrait: string;
}

export interface TtsJobData {
  publication_id: string;
  texte: string;
}
