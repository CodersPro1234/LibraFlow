import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import { supabaseAdmin } from '../config/supabase';
import { AuthError, NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import type { Role } from '../types';
import type { HistoriqueLectureRow } from '../types/db';

// ── Profil ────────────────────────────────────────────────────────────────────

export async function getProfile(userId: string, role: Role): Promise<Record<string, unknown>> {
  let data: Record<string, unknown> | null = null;
  let error: { message: string } | null = null;

  if (role === 'etudiant') {
    const result = await supabaseAdmin
      .from('etudiants')
      .select('id, universite_id, numero_ine, nom_complet, photo_url, statut, created_at, universite:universites(id, nom_officiel, logo_url)')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  } else if (role === 'professeur') {
    const result = await supabaseAdmin
      .from('professeurs')
      .select('id, universite_id, nom_complet, email_pro, photo_url, matieres, statut, created_at, validated_at, universite:universites(id, nom_officiel, logo_url)')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  } else if (role === 'universite') {
    const result = await supabaseAdmin
      .from('universites')
      .select('id, nom_officiel, adresse, email, logo_url, nom_administrateur, numero_agrement, region, latitude, longitude, statut, created_at, validated_at')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  } else if (role === 'ministere') {
    const result = await supabaseAdmin
      .from('ministere')
      .select('id, email, nom_officiel, created_at')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  }

  if (error) throw new ValidationError(`Erreur base de données : ${error.message}`);
  if (!data) throw new NotFoundError('Profil');

  return data;
}

export interface UpdateProfileInput {
  nom_complet?: string;
  matieres?: string[];
  photoBuffer?: Buffer;
  photoMimetype?: string;
  photoOriginalname?: string;
}

export async function updateProfile(userId: string, role: Role, input: UpdateProfileInput): Promise<void> {
  if (role !== 'professeur' && role !== 'etudiant') {
    throw new ValidationError('Modification de profil non supportée pour ce rôle');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {};

  if (input.nom_complet) patch['nom_complet'] = input.nom_complet;

  if (role === 'professeur' && input.matieres) {
    patch['matieres'] = input.matieres;
  }

  if (input.photoBuffer) {
    const compressed = await sharp(input.photoBuffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const ext = 'jpg';
    const storagePath = `photos/${role}s/${userId}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(storagePath, compressed, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) throw new ValidationError(`Erreur upload photo : ${uploadError.message}`);

    const { data: urlData } = supabaseAdmin.storage.from('avatars').getPublicUrl(storagePath);
    patch['photo_url'] = urlData.publicUrl;
  }

  if (Object.keys(patch).length === 0) return;

  const table = role === 'professeur' ? 'professeurs' : 'etudiants';
  const { error } = await supabaseAdmin.from(table).update(patch).eq('id', userId);
  if (error) throw new ValidationError(`Erreur mise à jour profil : ${error.message}`);

  logger.info({ userId, role }, 'Profil mis à jour');
}

// ── Mot de passe ──────────────────────────────────────────────────────────────

export async function changePassword(
  userId: string,
  role: Role,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const table = role === 'ministere' ? 'ministere'
    : role === 'universite' ? 'universites'
    : role === 'professeur' ? 'professeurs'
    : 'etudiants';

  const { data, error } = await supabaseAdmin
    .from(table)
    .select('id, password_hash')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) throw new NotFoundError('Utilisateur');

  const isValid = await bcrypt.compare(currentPassword, (data as { password_hash: string }).password_hash);
  if (!isValid) throw new AuthError('Mot de passe actuel incorrect');

  const newHash = await bcrypt.hash(newPassword, 12);
  const { error: updateError } = await supabaseAdmin
    .from(table)
    .update({ password_hash: newHash })
    .eq('id', userId);

  if (updateError) throw new ValidationError(`Erreur mise à jour mot de passe : ${updateError.message}`);

  logger.info({ userId, role }, 'Mot de passe changé');
}

// ── Stats publications professeur ─────────────────────────────────────────────

export async function getMesPublicationsStats(professeurId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .select('vues_count, likes_count, telechargements_count, commentaires_count')
    .eq('professeur_id', professeurId);

  if (error) throw new ValidationError(error.message);

  const rows = data ?? [];
  const stats = rows.reduce(
    (acc, row) => ({
      total_vues: acc.total_vues + (row.vues_count ?? 0),
      total_likes: acc.total_likes + (row.likes_count ?? 0),
      total_telechargements: acc.total_telechargements + (row.telechargements_count ?? 0),
      total_commentaires: acc.total_commentaires + (row.commentaires_count ?? 0),
    }),
    { total_vues: 0, total_likes: 0, total_telechargements: 0, total_commentaires: 0 }
  );

  return { ...stats, total_publications: rows.length };
}

// ── Historique de lecture étudiant ────────────────────────────────────────────

export async function getHistorique(
  etudiantId: string,
  cursor?: string
): Promise<{ data: HistoriqueLectureRow[]; cursor_next: string | null; has_more: boolean }> {
  const limit = 20;

  let query = supabaseAdmin
    .from('historique_lecture')
    .select('*, publication:publications(id, titre, matiere, niveau, type_doc, pdf_url, professeur:professeurs(nom_complet))')
    .eq('etudiant_id', etudiantId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) throw new ValidationError(error.message);

  const rows = (data ?? []) as HistoriqueLectureRow[];
  const has_more = rows.length > limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;

  return { data: rows, cursor_next, has_more };
}

export async function addHistorique(
  etudiantId: string,
  publicationId: string,
  typeAction: 'vue' | 'telecharge' | 'ecoute' = 'vue'
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('historique_lecture')
    .upsert(
      { etudiant_id: etudiantId, publication_id: publicationId, type_action: typeAction, created_at: new Date().toISOString() },
      { onConflict: 'etudiant_id,publication_id,type_action', ignoreDuplicates: false }
    );

  if (error) throw new ValidationError(error.message);
}

// ── Téléchargements étudiant ──────────────────────────────────────────────────

export async function getDownloads(
  etudiantId: string,
  cursor?: string
): Promise<{ data: HistoriqueLectureRow[]; cursor_next: string | null; has_more: boolean }> {
  const limit = 20;

  let query = supabaseAdmin
    .from('historique_lecture')
    .select('*, publication:publications(id, titre, matiere, niveau, type_doc, pdf_url, professeur:professeurs(nom_complet), universite:universites(nom_officiel))')
    .eq('etudiant_id', etudiantId)
    .eq('type_action', 'telecharge')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) throw new ValidationError(error.message);

  const rows = (data ?? []) as HistoriqueLectureRow[];
  const has_more = rows.length > limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;

  return { data: rows, cursor_next, has_more };
}

// ── Abonnés du professeur (paginés) ──────────────────────────────────────────

export async function getAbonnes(
  professeurId: string,
  cursor?: string
): Promise<{ data: unknown[]; cursor_next: string | null; has_more: boolean }> {
  const limit = 20;

  let query = supabaseAdmin
    .from('abonnements')
    .select('id, follower_id, follower_role, created_at')
    .eq('cible_id', professeurId)
    .eq('cible_type', 'professeur')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) throw new ValidationError(error.message);

  const rows = data ?? [];
  const has_more = rows.length > limit;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0
    ? (rows[rows.length - 1] as { created_at: string }).created_at
    : null;

  return { data: rows, cursor_next, has_more };
}

// ── Interactions récentes sur les publications du professeur ──────────────────

export async function getInteractionsRecentes(professeurId: string): Promise<Record<string, unknown>> {
  const [likesResult, commentairesResult] = await Promise.all([
    supabaseAdmin
      .from('likes')
      .select('id, user_id, user_role, created_at, publication:publications!inner(id, titre, professeur_id)')
      .eq('publication.professeur_id', professeurId)
      .order('created_at', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('commentaires')
      .select('id, user_id, user_role, contenu, created_at, publication:publications!inner(id, titre, professeur_id)')
      .eq('publication.professeur_id', professeurId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return {
    likes_recents: likesResult.data ?? [],
    commentaires_recents: commentairesResult.data ?? [],
  };
}
