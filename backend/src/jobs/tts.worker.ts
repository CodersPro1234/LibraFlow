import { Worker, type Job } from 'bullmq';
import axios from 'axios';
import redis from '../config/redis';
import { env } from '../config/env';
import * as pubRepo from '../repositories/publications.repository';
import logger from '../utils/logger';
import type { TtsJobData } from './queues';

interface IaTtsResponse {
  audio_url: string;
}

async function processTts(job: Job<TtsJobData>): Promise<void> {
  const { publication_id, texte } = job.data;

  logger.info({ publication_id, jobId: job.id }, 'Début génération TTS');

  const { data } = await axios.post<IaTtsResponse>(
    `${env.iaServiceUrl}/tts`,
    { texte, publication_id },
    { timeout: 120_000 }
  );

  await pubRepo.updateAudioUrl(publication_id, data.audio_url);

  logger.info({ publication_id, audioUrl: data.audio_url }, 'TTS généré');
}

export function startTtsWorker(): Worker<TtsJobData> {
  const worker = new Worker<TtsJobData>('tts', processTts, {
    connection: redis,
    concurrency: 2,
  });

  worker.on('completed', (job) => logger.info({ jobId: job.id }, 'Job TTS terminé'));
  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'Job TTS échoué'));

  return worker;
}
