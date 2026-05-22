import * as univRepo from '../repositories/universite.repository';
import * as notifRepo from '../repositories/notification.repository';
import * as auditRepo from '../repositories/audit.repository';
import * as pubRepo from '../repositories/publications.repository';
import { supabaseAdmin } from '../config/supabase';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import type { PublicationWithRelations } from '../repositories/publications.repository';

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

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboard(universiteId: string): Promise<Record<string, unknown>> {
  const [statsResult, professeursResult, recentPubs] = await Promise.all([
    supabaseAdmin
      .from('mv_universite_stats')
      .select('etudiants_count, professeurs_count, publications_count, total_vues, total_likes')
      .eq('universite_id', universiteId)
      .maybeSingle(),
    supabaseAdmin
      .from('professeurs')
      .select('id, nom_complet, email_pro, matieres, statut, created_at')
      .eq('universite_id', universiteId)
      .eq('statut', 'en_attente')
      .limit(5),
    pubRepo.findByUniversite(universiteId, undefined, 5),
  ]);

  return {
    statistiques: statsResult.data ?? {},
    professeurs_en_attente: professeursResult.data ?? [],
    publications_recentes: recentPubs,
  };
}

// ── Professeurs ───────────────────────────────────────────────────────────────

export async function listProfesseurs(params: {
  universiteId: string;
  statut?: string;
  cursor?: string;
  limit: number;
}): Promise<{ data: unknown[]; cursor_next: string | null; has_more: boolean }> {
  let query = supabaseAdmin
    .from('professeurs')
    .select('id, nom_complet, email_pro, photo_url, matieres, statut, created_at, validated_at')
    .eq('universite_id', params.universiteId)
    .order('created_at', { ascending: false })
    .limit(params.limit + 1);

  if (params.statut) query = query.eq('statut', params.statut);
  if (params.cursor) query = query.lt('created_at', params.cursor);

  const { data, error } = await query;
  if (error) throw new ValidationError(error.message);

  const rows = data ?? [];
  const has_more = rows.length > params.limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0
    ? (rows[rows.length - 1] as Record<string, string>)['created_at'] ?? null
    : null;

  return { data: rows, cursor_next, has_more };
}

// ── Étudiants ─────────────────────────────────────────────────────────────────

export async function listEtudiants(params: {
  universiteId: string;
  cursor?: string;
  limit: number;
}): Promise<{ data: unknown[]; cursor_next: string | null; has_more: boolean }> {
  let query = supabaseAdmin
    .from('etudiants')
    .select('id, numero_ine, nom_complet, photo_url, statut, created_at')
    .eq('universite_id', params.universiteId)
    .order('created_at', { ascending: false })
    .limit(params.limit + 1);

  if (params.cursor) query = query.lt('created_at', params.cursor);

  const { data, error } = await query;
  if (error) throw new ValidationError(error.message);

  const rows = data ?? [];
  const has_more = rows.length > params.limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0
    ? (rows[rows.length - 1] as Record<string, string>)['created_at'] ?? null
    : null;

  return { data: rows, cursor_next, has_more };
}

export async function suspendreEtudiant(
  universiteId: string,
  etudiantId: string,
  motif: string
): Promise<void> {
  const { data: etudiant, error } = await supabaseAdmin
    .from('etudiants')
    .select('id, universite_id, statut')
    .eq('id', etudiantId)
    .maybeSingle();

  if (error) throw new ValidationError(error.message);
  if (!etudiant) throw new NotFoundError('Étudiant');
  if ((etudiant as { universite_id: string }).universite_id !== universiteId) {
    throw new ForbiddenError("Cet étudiant n'appartient pas à votre université");
  }
  if ((etudiant as { statut: string }).statut !== 'actif') {
    throw new ValidationError('Seul un étudiant actif peut être suspendu');
  }

  const { error: updateError } = await supabaseAdmin
    .from('etudiants')
    .update({ statut: 'suspendu' })
    .eq('id', etudiantId);

  if (updateError) throw new ValidationError(updateError.message);

  await auditRepo.createAuditLog({
    action: 'suspendre_etudiant',
    acteur_id: universiteId,
    acteur_role: 'universite',
    cible_id: etudiantId,
    cible_type: 'etudiant',
    motif,
  });

  logger.info({ universiteId, etudiantId, motif }, 'Étudiant suspendu');
}

export async function reactiverEtudiant(universiteId: string, etudiantId: string): Promise<void> {
  const { data: etudiant, error } = await supabaseAdmin
    .from('etudiants')
    .select('id, universite_id, statut')
    .eq('id', etudiantId)
    .maybeSingle();

  if (error) throw new ValidationError(error.message);
  if (!etudiant) throw new NotFoundError('Étudiant');
  if ((etudiant as { universite_id: string }).universite_id !== universiteId) {
    throw new ForbiddenError("Cet étudiant n'appartient pas à votre université");
  }
  if ((etudiant as { statut: string }).statut !== 'suspendu') {
    throw new ValidationError('Seul un étudiant suspendu peut être réactivé');
  }

  const { error: updateError } = await supabaseAdmin
    .from('etudiants')
    .update({ statut: 'actif' })
    .eq('id', etudiantId);

  if (updateError) throw new ValidationError(updateError.message);

  await auditRepo.createAuditLog({
    action: 'reactiver_etudiant',
    acteur_id: universiteId,
    acteur_role: 'universite',
    cible_id: etudiantId,
    cible_type: 'etudiant',
  });

  logger.info({ universiteId, etudiantId }, 'Étudiant réactivé');
}

export async function supprimerPublication(universiteId: string, publicationId: string): Promise<void> {
  const { data: pub, error } = await supabaseAdmin
    .from('publications')
    .select('id, universite_id, statut_moderation')
    .eq('id', publicationId)
    .maybeSingle();

  if (error) throw new ValidationError(error.message);
  if (!pub) throw new NotFoundError('Publication');
  if ((pub as { universite_id: string }).universite_id !== universiteId) {
    throw new ForbiddenError("Cette publication n'appartient pas à votre université");
  }

  const { error: updateError } = await supabaseAdmin
    .from('publications')
    .update({ statut_moderation: 'rejetee' })
    .eq('id', publicationId);

  if (updateError) throw new ValidationError(updateError.message);

  await auditRepo.createAuditLog({
    action: 'supprimer_publication_universite',
    acteur_id: universiteId,
    acteur_role: 'universite',
    cible_id: publicationId,
    cible_type: 'publication',
  });

  logger.info({ universiteId, publicationId }, 'Publication supprimée par université');
}

export async function getTopPublications(universiteId: string): Promise<unknown[]> {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .select('id, titre, matiere, niveau, type_doc, vues_count, likes_count, telechargements_count, commentaires_count, created_at, professeur:professeurs(nom_complet)')
    .eq('universite_id', universiteId)
    .eq('statut_moderation', 'validee')
    .order('likes_count', { ascending: false })
    .limit(10);

  if (error) throw new ValidationError(error.message);
  return data ?? [];
}

export async function getEvolutionMensuelle(universiteId: string): Promise<unknown[]> {
  const { data, error } = await supabaseAdmin
    .from('mv_evolution_mensuelle')
    .select('*')
    .eq('universite_id', universiteId)
    .order('mois', { ascending: true })
    .limit(12);

  if (error) {
    logger.warn({ err: error, universiteId }, 'mv_evolution_mensuelle indisponible pour université');
    return [];
  }
  return data ?? [];
}

// ── Publications université ───────────────────────────────────────────────────

export async function listPublications(params: {
  universiteId: string;
  cursor?: string;
  limit: number;
}): Promise<{ data: PublicationWithRelations[]; cursor_next: string | null; has_more: boolean }> {
  const rows = await pubRepo.findByUniversite(params.universiteId, params.cursor, params.limit);
  const has_more = rows.length > params.limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;
  return { data: rows, cursor_next, has_more };
}
