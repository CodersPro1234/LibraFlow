import * as univRepo from '../repositories/universite.repository';
import * as notifRepo from '../repositories/notification.repository';
import * as auditRepo from '../repositories/audit.repository';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Valide un professeur en attente.
 * Vérifie que le professeur appartient bien à l'université qui effectue la validation.
 */
export async function validerProfesseur(universiteId: string, professeurId: string): Promise<void> {
  const prof = await univRepo.findProfesseurById(professeurId);
  if (!prof) throw new NotFoundError('Professeur');
  if (prof.universite_id !== universiteId) {
    throw new ForbiddenError("Ce professeur n'appartient pas à votre université");
  }
  if (prof.statut !== 'en_attente') {
    throw new ValidationError(`Transition impossible : statut actuel = ${prof.statut}. Seul un professeur 'en_attente' peut être validé.`);
  }

  await univRepo.updateProfesseurStatut(professeurId, 'actif', null, universiteId);

  await notifRepo.createNotification({
    destinataire_id: professeurId,
    destinataire_role: 'professeur',
    type: 'prof_valide',
    titre: 'Compte validé',
    message: 'Votre compte professeur a été validé. Vous pouvez désormais publier des cours.',
    lien: '/dashboard',
  });

  await auditRepo.createAuditLog({
    action: 'valider_professeur',
    acteur_id: universiteId,
    acteur_role: 'universite',
    cible_id: professeurId,
    cible_type: 'professeur',
  });

  logger.info({ universiteId, professeurId }, 'Professeur validé');
}

/**
 * Rejette un professeur en attente avec un motif obligatoire.
 */
export async function rejeterProfesseur(
  universiteId: string,
  professeurId: string,
  motif: string
): Promise<void> {
  const prof = await univRepo.findProfesseurById(professeurId);
  if (!prof) throw new NotFoundError('Professeur');
  if (prof.universite_id !== universiteId) {
    throw new ForbiddenError("Ce professeur n'appartient pas à votre université");
  }
  if (prof.statut !== 'en_attente') {
    throw new ValidationError(`Transition impossible : statut actuel = ${prof.statut}. Seul un professeur 'en_attente' peut être rejeté.`);
  }

  await univRepo.updateProfesseurStatut(professeurId, 'rejete', motif, universiteId);

  await notifRepo.createNotification({
    destinataire_id: professeurId,
    destinataire_role: 'professeur',
    type: 'prof_rejete',
    titre: 'Compte rejeté',
    message: `Votre demande d'inscription a été rejetée. Motif : ${motif}`,
    lien: '/support',
  });

  await auditRepo.createAuditLog({
    action: 'rejeter_professeur',
    acteur_id: universiteId,
    acteur_role: 'universite',
    cible_id: professeurId,
    cible_type: 'professeur',
    motif,
  });

  logger.info({ universiteId, professeurId, motif }, 'Professeur rejeté');
}

/**
 * Suspend un professeur actif avec un motif obligatoire.
 */
export async function suspendreProfesseur(
  universiteId: string,
  professeurId: string,
  motif: string
): Promise<void> {
  const prof = await univRepo.findProfesseurById(professeurId);
  if (!prof) throw new NotFoundError('Professeur');
  if (prof.universite_id !== universiteId) {
    throw new ForbiddenError("Ce professeur n'appartient pas à votre université");
  }
  if (prof.statut !== 'actif') {
    throw new ValidationError(`Transition impossible : statut actuel = ${prof.statut}. Seul un professeur 'actif' peut être suspendu.`);
  }

  await univRepo.updateProfesseurStatut(professeurId, 'suspendu', motif, null);

  await notifRepo.createNotification({
    destinataire_id: professeurId,
    destinataire_role: 'professeur',
    type: 'message_universite',
    titre: 'Compte suspendu',
    message: `Votre compte a été suspendu par votre université. Motif : ${motif}`,
  });

  await auditRepo.createAuditLog({
    action: 'suspendre_professeur',
    acteur_id: universiteId,
    acteur_role: 'universite',
    cible_id: professeurId,
    cible_type: 'professeur',
    motif,
  });

  logger.info({ universiteId, professeurId, motif }, 'Professeur suspendu');
}
