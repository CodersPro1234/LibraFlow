import { Worker, type Job } from 'bullmq';
import axios from 'axios';
import { redisBullMQ } from '../config/redis';
import { env } from '../config/env';
import * as pubRepo from '../repositories/publications.repository';
import * as notifRepo from '../repositories/notification.repository';
import logger from '../utils/logger';
import type { ModerationJobData } from './queues';

interface IaModerationResponse {
  statut: 'valide' | 'signale';
  score_fiabilite: number;
  resume: string;
  rapport: {
    pertinence_educative: boolean;
    coherence_matiere: boolean;
    plagiat_detecte: boolean;
    contenu_inapproprie: boolean;
    raisons: string[];
  };
}

async function processModeration(job: Job<ModerationJobData>): Promise<void> {
  const { publication_id, titre, matiere, texte_extrait } = job.data;

  logger.info({ publication_id, jobId: job.id }, 'Début modération IA');

  let iaResponse: IaModerationResponse;

  try {
    const { data } = await axios.post<IaModerationResponse>(
      `${env.iaServiceUrl}/moderate`,
      { texte: texte_extrait, matiere, titre },
      { timeout: 60_000 }
    );
    iaResponse = data;
  } catch (err) {
    logger.error({ publication_id, err }, 'Erreur appel service IA — publication rejetée par défaut');
    await pubRepo.updateModerationResult(publication_id, { statut_moderation: 'en_analyse' });
    throw err;
  }

  const statutModeration = iaResponse.statut === 'valide' ? 'validee' : 'signalee';

  await pubRepo.updateModerationResult(publication_id, {
    statut_moderation: statutModeration,
    resume_ia: iaResponse.resume,
    score_fiabilite: iaResponse.score_fiabilite,
    rapport_ia: iaResponse.rapport as unknown as Record<string, unknown>,
  });

  if (statutModeration === 'signalee') {
    await pubRepo.createSignalement({
      publication_id,
      source: 'ia',
      motif: iaResponse.rapport.contenu_inapproprie ? 'inapproprie' :
             iaResponse.rapport.plagiat_detecte ? 'plagiat' : 'autre',
      description: iaResponse.rapport.raisons.join(', '),
    });
  }

  // Notifier le professeur
  const pub = await pubRepo.findById(publication_id);
  if (pub) {
    await notifRepo.createNotification({
      destinataire_id: pub.professeur_id,
      destinataire_role: 'professeur',
      type: statutModeration === 'validee' ? 'document_valide' : 'document_signale',
      titre: statutModeration === 'validee' ? 'Publication validée' : 'Publication signalée',
      message: statutModeration === 'validee'
        ? `Votre publication "${titre}" a été validée et est désormais visible.`
        : `Votre publication "${titre}" a été signalée par l'analyse IA. Motif : ${iaResponse.rapport.raisons.join(', ')}`,
      lien: `/publications/${publication_id}`,
    });
  }

  logger.info({ publication_id, statut: statutModeration, score: iaResponse.score_fiabilite }, 'Modération terminée');
}

export function startModerationWorker(): Worker<ModerationJobData> {
  const worker = new Worker<ModerationJobData>('moderation', processModeration, {
    connection: redisBullMQ,
    concurrency: 3,
  });

  worker.on('completed', (job) => logger.info({ jobId: job.id }, 'Job modération terminé'));
  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'Job modération échoué'));

  return worker;
}
