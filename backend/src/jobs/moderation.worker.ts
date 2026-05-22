import { Worker, type Job } from 'bullmq';
import axios from 'axios';
import { redisBullMQ } from '../config/redis';
import { env } from '../config/env';
import * as pubRepo from '../repositories/publications.repository';
import * as notifRepo from '../repositories/notification.repository';
import logger from '../utils/logger';
import type { ModerationJobData } from './queues';

interface IaModerationResponse {
  status: 'validee' | 'signalee';
  score_fiabilite: number;
  resume: string;
  embedding: number[];
  raisons: {
    pertinence: { score: number; detail: string };
    coherence_matiere: { score: number; detail: string };
    plagiat: { score: number; similaires: { publication_id: string; score: number }[] };
    contenu_inapproprie: { detected: boolean; detail: string };
  };
  duree_analyse_ms: number;
}

async function processModeration(job: Job<ModerationJobData>): Promise<void> {
  const { publication_id, titre, matiere, niveau, type_doc, pdf_url } = job.data;

  logger.info({ publication_id, jobId: job.id }, 'Début modération IA');

  let iaResponse: IaModerationResponse;

  try {
    const { data } = await axios.post<IaModerationResponse>(
      `${env.iaServiceUrl}/ai/moderate`,
      { publicationId: publication_id, titre, matiere, niveau, type_doc, pdf_url },
      { timeout: 60_000 }
    );
    iaResponse = data;
  } catch (err) {
    logger.error({ publication_id, err }, 'Erreur appel service IA — publication reste en_analyse');
    await pubRepo.updateModerationResult(publication_id, { statut_moderation: 'en_analyse' });
    throw err;
  }

  const statutModeration = iaResponse.status;

  // Déterminer le motif de signalement depuis la nouvelle structure
  const motifSignalement = iaResponse.raisons.contenu_inapproprie.detected
    ? ('inapproprie' as const)
    : iaResponse.raisons.plagiat.score > 70
      ? ('plagiat' as const)
      : ('autre' as const);

  await pubRepo.updateModerationResult(publication_id, {
    statut_moderation: statutModeration,
    resume_ia: iaResponse.resume,
    score_fiabilite: iaResponse.score_fiabilite,
    rapport_ia: iaResponse.raisons as unknown as Record<string, unknown>,
  });

  if (statutModeration === 'signalee') {
    const descriptionMotifs = [
      `Pertinence : ${iaResponse.raisons.pertinence.score}/100 — ${iaResponse.raisons.pertinence.detail}`,
      `Cohérence : ${iaResponse.raisons.coherence_matiere.score}/100 — ${iaResponse.raisons.coherence_matiere.detail}`,
      ...(iaResponse.raisons.contenu_inapproprie.detected ? [`Contenu inapproprié : ${iaResponse.raisons.contenu_inapproprie.detail}`] : []),
    ].join(' | ');

    await pubRepo.createSignalement({
      publication_id,
      source: 'ia',
      motif: motifSignalement,
      description: descriptionMotifs,
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
        : `Votre publication "${titre}" a été signalée par l'analyse IA (score fiabilité : ${iaResponse.score_fiabilite}/100).`,
      lien: `/publications/${publication_id}`,
    });
  }

  logger.info(
    { publication_id, statut: statutModeration, score: iaResponse.score_fiabilite, duree_ms: iaResponse.duree_analyse_ms },
    'Modération terminée'
  );
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
