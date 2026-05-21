import * as minRepo from '../repositories/ministere.repository';
import * as notifRepo from '../repositories/notification.repository';
import * as auditRepo from '../repositories/audit.repository';
import * as pubRepo from '../repositories/publications.repository';
import { supabaseAdmin } from '../config/supabase';
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

// ── Dashboard & stats ─────────────────────────────────────────────────────────

export async function getDashboard(): Promise<Record<string, unknown>> {
  const { data: stats, error: statsError } = await supabaseAdmin
    .from('mv_ministere_stats')
    .select('*')
    .maybeSingle();

  if (statsError) logger.warn({ err: statsError }, 'mv_ministere_stats indisponible');

  const { data: universites, error: univError } = await supabaseAdmin
    .from('universites')
    .select('id, nom_officiel, statut, region, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (univError) throw new ValidationError(univError.message);

  const { data: recentPubs } = await supabaseAdmin
    .from('publications')
    .select('id, titre, statut_moderation, created_at, professeur:professeurs(nom_complet), universite:universites(nom_officiel)')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    statistiques: stats ?? {},
    universites_recentes: universites ?? [],
    publications_recentes: recentPubs ?? [],
  };
}

export async function listUniversites(params: {
  statut?: string;
  cursor?: string;
  limit: number;
}): Promise<{ data: unknown[]; cursor_next: string | null; has_more: boolean }> {
  let query = supabaseAdmin
    .from('universites')
    .select('id, nom_officiel, adresse, email, logo_url, region, statut, created_at, validated_at')
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

export async function getUniversiteDossier(universiteId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabaseAdmin
    .from('universites')
    .select('*')
    .eq('id', universiteId)
    .maybeSingle();

  if (error) throw new ValidationError(error.message);
  if (!data) throw new NotFoundError('Université');

  return data as Record<string, unknown>;
}

export async function getStatistiques(): Promise<Record<string, unknown>> {
  const [statsResult, evolutionResult] = await Promise.all([
    supabaseAdmin.from('mv_ministere_stats').select('*').maybeSingle(),
    supabaseAdmin.from('mv_evolution_mensuelle').select('*').limit(12),
  ]);

  return {
    global: statsResult.data ?? {},
    evolution_mensuelle: evolutionResult.data ?? [],
  };
}

// ── Signalements ──────────────────────────────────────────────────────────────

export async function listSignalements(params: {
  cursor?: string;
  limit: number;
}): Promise<{ data: unknown[]; cursor_next: string | null; has_more: boolean }> {
  const rows = await pubRepo.findSignalements({ statut: 'en_attente', ...params });
  const has_more = rows.length > params.limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;
  return { data: rows, cursor_next, has_more };
}

export async function traiterSignalement(
  signalementId: string,
  ministereId: string,
  action: 'supprimer' | 'innocenter' | 'avertir'
): Promise<void> {
  const statutMap = {
    supprimer: 'supprime',
    innocenter: 'innocente',
    avertir: 'averti',
  } as const;

  await pubRepo.updateSignalementStatut(signalementId, statutMap[action], ministereId);

  if (action === 'supprimer') {
    // Récupérer la publication liée pour la supprimer aussi
    const { data: signalement } = await supabaseAdmin
      .from('signalements')
      .select('publication_id')
      .eq('id', signalementId)
      .maybeSingle();

    if (signalement) {
      const pubId = (signalement as { publication_id: string }).publication_id;
      await pubRepo.updateModerationResult(pubId, { statut_moderation: 'rejetee' });
      await auditRepo.createAuditLog({
        action: 'supprimer_publication',
        acteur_id: ministereId,
        acteur_role: 'ministere',
        cible_id: pubId,
        cible_type: 'publication',
      });
    }
  }

  logger.info({ signalementId, action, ministereId }, 'Signalement traité');
}
