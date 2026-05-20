import * as minRepo from '../repositories/ministere.repository';
import * as notifRepo from '../repositories/notification.repository';
import * as auditRepo from '../repositories/audit.repository';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Approuve une université en attente. Message d'accompagnement optionnel.
 */
export async function approuverUniversite(
  ministereId: string,
  universiteId: string,
  message?: string
): Promise<void> {
  const univ = await minRepo.findUniversiteById(universiteId);
  if (!univ) throw new NotFoundError('Université');
  if (univ.statut !== 'en_attente') {
    throw new ValidationError(`Transition impossible : statut actuel = ${univ.statut}. Seule une université 'en_attente' peut être approuvée.`);
  }

  await minRepo.updateUniversiteStatut(universiteId, 'approuvee', null, ministereId);

  const notifMessage = message
    ?? "Votre université a été approuvée par le Ministère de l'Éducation. Vous pouvez désormais valider vos professeurs.";

  await notifRepo.createNotification({
    destinataire_id: universiteId,
    destinataire_role: 'universite',
    type: 'universite_approuvee',
    titre: 'Université approuvée',
    message: notifMessage,
    lien: '/dashboard',
  });

  await auditRepo.createAuditLog({
    action: 'approuver_universite',
    acteur_id: ministereId,
    acteur_role: 'ministere',
    cible_id: universiteId,
    cible_type: 'universite',
    metadata: message ? { message } : undefined,
  });

  logger.info({ ministereId, universiteId }, 'Université approuvée');
}

/**
 * Rejette une université en attente avec un motif obligatoire.
 */
export async function rejeterUniversite(
  ministereId: string,
  universiteId: string,
  motif: string
): Promise<void> {
  const univ = await minRepo.findUniversiteById(universiteId);
  if (!univ) throw new NotFoundError('Université');
  if (univ.statut !== 'en_attente') {
    throw new ValidationError(`Transition impossible : statut actuel = ${univ.statut}. Seule une université 'en_attente' peut être rejetée.`);
  }

  await minRepo.updateUniversiteStatut(universiteId, 'rejetee', motif, ministereId);

  await notifRepo.createNotification({
    destinataire_id: universiteId,
    destinataire_role: 'universite',
    type: 'universite_rejetee',
    titre: "Demande d'accréditation rejetée",
    message: `Votre demande d'accréditation a été rejetée. Motif : ${motif}`,
    lien: '/support',
  });

  await auditRepo.createAuditLog({
    action: 'rejeter_universite',
    acteur_id: ministereId,
    acteur_role: 'ministere',
    cible_id: universiteId,
    cible_type: 'universite',
    motif,
  });

  logger.info({ ministereId, universiteId, motif }, 'Université rejetée');
}

/**
 * Suspend une université approuvée avec un motif obligatoire.
 */
export async function suspendreUniversite(
  ministereId: string,
  universiteId: string,
  motif: string
): Promise<void> {
  const univ = await minRepo.findUniversiteById(universiteId);
  if (!univ) throw new NotFoundError('Université');
  if (univ.statut !== 'approuvee') {
    throw new ValidationError(`Transition impossible : statut actuel = ${univ.statut}. Seule une université 'approuvee' peut être suspendue.`);
  }

  await minRepo.updateUniversiteStatut(universiteId, 'suspendue', motif, null);

  await notifRepo.createNotification({
    destinataire_id: universiteId,
    destinataire_role: 'universite',
    type: 'universite_suspendue',
    titre: 'Université suspendue',
    message: `Votre université a été suspendue par le Ministère. Motif : ${motif}`,
  });

  await auditRepo.createAuditLog({
    action: 'suspendre_universite',
    acteur_id: ministereId,
    acteur_role: 'ministere',
    cible_id: universiteId,
    cible_type: 'universite',
    motif,
  });

  logger.info({ ministereId, universiteId, motif }, 'Université suspendue');
}

/**
 * Réactive une université suspendue.
 */
export async function reactiverUniversite(
  ministereId: string,
  universiteId: string
): Promise<void> {
  const univ = await minRepo.findUniversiteById(universiteId);
  if (!univ) throw new NotFoundError('Université');
  if (univ.statut !== 'suspendue') {
    throw new ValidationError(`Transition impossible : statut actuel = ${univ.statut}. Seule une université 'suspendue' peut être réactivée.`);
  }

  await minRepo.updateUniversiteStatut(universiteId, 'approuvee', null, ministereId);

  await notifRepo.createNotification({
    destinataire_id: universiteId,
    destinataire_role: 'universite',
    type: 'universite_approuvee',
    titre: 'Université réactivée',
    message: "Votre université a été réactivée par le Ministère de l'Éducation.",
    lien: '/dashboard',
  });

  await auditRepo.createAuditLog({
    action: 'approuver_universite',
    acteur_id: ministereId,
    acteur_role: 'ministere',
    cible_id: universiteId,
    cible_type: 'universite',
    metadata: { action_reelle: 'reactiver' },
  });

  logger.info({ ministereId, universiteId }, 'Université réactivée');
}
