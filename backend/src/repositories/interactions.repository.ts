import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import type { LikeRow, CommentaireRow, FavoriRow, AbonnementRow } from '../types/db';

function throwDbError(error: { message: string }): never {
  throw new AppError(`Erreur base de données : ${error.message}`, 500, 'DB_ERROR', undefined, false);
}

// ── Likes ─────────────────────────────────────────────────────────────────────

export async function addLike(publicationId: string, userId: string, userRole: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('likes')
    .insert({ publication_id: publicationId, user_id: userId, user_role: userRole });

  if (error) throwDbError(error);
}

export async function removeLike(publicationId: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('likes')
    .delete()
    .eq('publication_id', publicationId)
    .eq('user_id', userId);

  if (error) throwDbError(error);
}

export async function findLike(publicationId: string, userId: string): Promise<LikeRow | null> {
  const { data, error } = await supabaseAdmin
    .from('likes')
    .select('*')
    .eq('publication_id', publicationId)
    .eq('user_id', userId)
    .maybeSingle<LikeRow>();

  if (error) throwDbError(error);
  return data;
}

export async function isLiked(publicationId: string, userId: string): Promise<boolean> {
  const like = await findLike(publicationId, userId);
  return like !== null;
}

export async function isLikedBatch(publicationIds: string[], userId: string): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from('likes')
    .select('publication_id')
    .eq('user_id', userId)
    .in('publication_id', publicationIds);

  if (error) throwDbError(error);
  return new Set((data ?? []).map((row: { publication_id: string }) => row.publication_id));
}

// ── Commentaires ──────────────────────────────────────────────────────────────

export interface CreateCommentaireInput {
  publication_id: string;
  user_id: string;
  user_role: string;
  contenu: string;
  parent_id?: string;
}

export async function createCommentaire(input: CreateCommentaireInput): Promise<CommentaireRow> {
  const { data, error } = await supabaseAdmin
    .from('commentaires')
    .insert(input)
    .select()
    .single<CommentaireRow>();

  if (error) throwDbError(error);
  return data!;
}

export async function findCommentaires(params: {
  publicationId: string;
  cursor?: string;
  limit: number;
}): Promise<CommentaireWithUser[]> {
  let query = supabaseAdmin
    .from('commentaires')
    .select('*')
    .eq('publication_id', params.publicationId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(params.limit + 1);

  if (params.cursor) query = query.lt('created_at', params.cursor);

  const { data, error } = await query.returns<CommentaireRow[]>();
  if (error) throwDbError(error);
  return (data ?? []) as CommentaireWithUser[];
}

export type CommentaireWithUser = CommentaireRow & {
  user_nom?: string;
  user_photo?: string | null;
};

export async function findCommentaireById(id: string): Promise<CommentaireRow | null> {
  const { data, error } = await supabaseAdmin
    .from('commentaires')
    .select('*')
    .eq('id', id)
    .maybeSingle<CommentaireRow>();

  if (error) throwDbError(error);
  return data;
}

export async function deleteCommentaire(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('commentaires')
    .delete()
    .eq('id', id);

  if (error) throwDbError(error);
}

export async function findRecentCommentairesByProfesseur(
  professeurId: string,
  limit = 10
): Promise<CommentaireRow[]> {
  const { data, error } = await supabaseAdmin
    .from('commentaires')
    .select('*, publication:publications!inner(professeur_id)')
    .eq('publication.professeur_id', professeurId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throwDbError(error);
  return (data as CommentaireRow[]) ?? [];
}

// ── Favoris ───────────────────────────────────────────────────────────────────

export async function addFavori(publicationId: string, userId: string, userRole: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('favoris')
    .insert({ publication_id: publicationId, user_id: userId, user_role: userRole });

  if (error) throwDbError(error);
}

export async function removeFavori(publicationId: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('favoris')
    .delete()
    .eq('publication_id', publicationId)
    .eq('user_id', userId);

  if (error) throwDbError(error);
}

export async function findFavori(publicationId: string, userId: string): Promise<FavoriRow | null> {
  const { data, error } = await supabaseAdmin
    .from('favoris')
    .select('*')
    .eq('publication_id', publicationId)
    .eq('user_id', userId)
    .maybeSingle<FavoriRow>();

  if (error) throwDbError(error);
  return data;
}

export async function isSavedBatch(publicationIds: string[], userId: string): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from('favoris')
    .select('publication_id')
    .eq('user_id', userId)
    .in('publication_id', publicationIds);

  if (error) throwDbError(error);
  return new Set((data ?? []).map((row: { publication_id: string }) => row.publication_id));
}

// ── Abonnements (follows) ─────────────────────────────────────────────────────

export async function addAbonnement(
  followerId: string,
  followerRole: string,
  cibleId: string,
  cibleType: 'professeur' | 'universite'
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('abonnements')
    .insert({ follower_id: followerId, follower_role: followerRole, cible_id: cibleId, cible_type: cibleType });

  if (error) throwDbError(error);
}

export async function removeAbonnement(
  followerId: string,
  cibleId: string,
  cibleType: 'professeur' | 'universite'
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('abonnements')
    .delete()
    .eq('follower_id', followerId)
    .eq('cible_id', cibleId)
    .eq('cible_type', cibleType);

  if (error) throwDbError(error);
}

export async function findAbonnement(
  followerId: string,
  cibleId: string,
  cibleType: 'professeur' | 'universite'
): Promise<AbonnementRow | null> {
  const { data, error } = await supabaseAdmin
    .from('abonnements')
    .select('*')
    .eq('follower_id', followerId)
    .eq('cible_id', cibleId)
    .eq('cible_type', cibleType)
    .maybeSingle<AbonnementRow>();

  if (error) throwDbError(error);
  return data;
}

/** IDs des entités suivies par un utilisateur (pour construire le feed) */
export async function findCiblesIdsByFollower(
  followerId: string,
  cibleType: 'professeur' | 'universite'
): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('abonnements')
    .select('cible_id')
    .eq('follower_id', followerId)
    .eq('cible_type', cibleType);

  if (error) throwDbError(error);
  return (data ?? []).map((row: { cible_id: string }) => row.cible_id);
}

/** Abonnés d'un professeur */
export async function findAbonnesCount(cibleId: string, cibleType: 'professeur' | 'universite'): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('abonnements')
    .select('*', { count: 'exact', head: true })
    .eq('cible_id', cibleId)
    .eq('cible_type', cibleType);

  if (error) throwDbError(error);
  return count ?? 0;
}

export async function findAbonnes(
  cibleId: string,
  cibleType: 'professeur' | 'universite',
  limit = 20
): Promise<AbonnementRow[]> {
  const { data, error } = await supabaseAdmin
    .from('abonnements')
    .select('*')
    .eq('cible_id', cibleId)
    .eq('cible_type', cibleType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throwDbError(error);
  return (data as AbonnementRow[]) ?? [];
}

export async function isFollowedBatch(
  cibleIds: string[],
  followerId: string,
  cibleType: 'professeur' | 'universite'
): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from('abonnements')
    .select('cible_id')
    .eq('follower_id', followerId)
    .eq('cible_type', cibleType)
    .in('cible_id', cibleIds);

  if (error) throwDbError(error);
  return new Set((data ?? []).map((row: { cible_id: string }) => row.cible_id));
}
