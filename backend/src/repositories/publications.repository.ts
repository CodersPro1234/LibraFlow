import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import type {
  PublicationRow,
  StatutModeration,
  NiveauPublication,
  TypeDoc,
  MotifSignalement,
  SignalementRow,
  PartageRow,
  HistoriqueLectureRow,
} from '../types/db';

function throwDbError(error: { message: string }): never {
  throw new AppError(`Erreur base de données : ${error.message}`, 500, 'DB_ERROR', undefined, false);
}

// ── Création ─────────────────────────────────────────────────────────────────

export interface CreatePublicationInput {
  professeur_id: string;
  universite_id: string;
  titre: string;
  matiere: string;
  niveau: NiveauPublication;
  type_doc: TypeDoc;
  description?: string;
  pdf_url: string;
  pdf_size_bytes?: number;
  texte_extrait?: string;
}

export async function createPublication(input: CreatePublicationInput): Promise<PublicationRow> {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .insert(input)
    .select()
    .single<PublicationRow>();

  if (error) throwDbError(error);
  return data!;
}

// ── Lecture ───────────────────────────────────────────────────────────────────

export async function findById(id: string): Promise<PublicationRow | null> {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .select('*')
    .eq('id', id)
    .maybeSingle<PublicationRow>();

  if (error) throwDbError(error);
  return data;
}

/** Retourne la publication avec les infos du professeur et de l'université jointes */
export async function findByIdWithRelations(id: string): Promise<PublicationWithRelations | null> {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .select(`
      *,
      professeur:professeurs(id, nom_complet, photo_url),
      universite:universites(id, nom_officiel, logo_url)
    `)
    .eq('id', id)
    .maybeSingle<PublicationWithRelations>();

  if (error) throwDbError(error);
  return data;
}

export type PublicationWithRelations = PublicationRow & {
  professeur: { id: string; nom_complet: string; photo_url: string | null };
  universite: { id: string; nom_officiel: string; logo_url: string | null };
};

/** Feed cursor-based : publications validées des abonnements (professeurs et universités suivis) */
export async function findFeed(params: {
  followerIds: string[];
  followerType: 'professeur' | 'universite';
  cursor?: string;
  limit: number;
}): Promise<PublicationWithRelations[]> {
  let query = supabaseAdmin
    .from('publications')
    .select(`
      *,
      professeur:professeurs(id, nom_complet, photo_url),
      universite:universites(id, nom_officiel, logo_url)
    `)
    .eq('statut_moderation', 'validee')
    .order('created_at', { ascending: false })
    .limit(params.limit + 1);

  if (params.followerType === 'professeur') {
    query = query.in('professeur_id', params.followerIds);
  } else {
    query = query.in('universite_id', params.followerIds);
  }

  if (params.cursor) {
    query = query.lt('created_at', params.cursor);
  }

  const { data, error } = await query.returns<PublicationWithRelations[]>();
  if (error) throwDbError(error);
  return data ?? [];
}

/** Feed général (sans filtrage par abonnements) */
export async function findGlobalFeed(params: {
  cursor?: string;
  limit: number;
}): Promise<PublicationWithRelations[]> {
  let query = supabaseAdmin
    .from('publications')
    .select(`
      *,
      professeur:professeurs(id, nom_complet, photo_url),
      universite:universites(id, nom_officiel, logo_url)
    `)
    .eq('statut_moderation', 'validee')
    .order('created_at', { ascending: false })
    .limit(params.limit + 1);

  if (params.cursor) {
    query = query.lt('created_at', params.cursor);
  }

  const { data, error } = await query.returns<PublicationWithRelations[]>();
  if (error) throwDbError(error);
  return data ?? [];
}

/** Recherche full-text via la fonction SQL `search_publications` */
export async function searchPublications(params: {
  q?: string;
  universite_id?: string;
  matiere?: string;
  niveau?: NiveauPublication;
  type_doc?: TypeDoc;
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
}): Promise<unknown[]> {
  const { data, error } = await supabaseAdmin.rpc('search_publications', {
    query: params.q ?? null,
    p_universite_id: params.universite_id ?? null,
    p_matiere: params.matiere ?? null,
    p_niveau: params.niveau ?? null,
    p_type_doc: params.type_doc ?? null,
    p_date_from: params.date_from ?? null,
    p_date_to: params.date_to ?? null,
    p_limit: params.limit,
    p_offset: params.offset,
  });

  if (error) throwDbError(error);
  return (data as unknown[]) ?? [];
}

/** Publications d'un professeur avec stats */
export async function findByProfesseur(
  professeurId: string,
  cursor?: string,
  limit = 20
): Promise<PublicationRow[]> {
  let query = supabaseAdmin
    .from('publications')
    .select('*')
    .eq('professeur_id', professeurId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query.returns<PublicationRow[]>();
  if (error) throwDbError(error);
  return data ?? [];
}

/** Publications d'une université (pour dashboard) */
export async function findByUniversite(
  universiteId: string,
  cursor?: string,
  limit = 20
): Promise<PublicationWithRelations[]> {
  let query = supabaseAdmin
    .from('publications')
    .select(`*, professeur:professeurs(id, nom_complet, photo_url), universite:universites(id, nom_officiel, logo_url)`)
    .eq('universite_id', universiteId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query.returns<PublicationWithRelations[]>();
  if (error) throwDbError(error);
  return data ?? [];
}

// ── Mise à jour ───────────────────────────────────────────────────────────────

export async function updatePublication(
  id: string,
  patch: Partial<Pick<PublicationRow, 'titre' | 'description'>>
): Promise<PublicationRow> {
  const { data, error } = await supabaseAdmin
    .from('publications')
    .update(patch)
    .eq('id', id)
    .select()
    .single<PublicationRow>();

  if (error) throwDbError(error);
  return data!;
}

/** Mise à jour suite analyse IA */
export async function updateModerationResult(
  id: string,
  patch: {
    statut_moderation: StatutModeration;
    resume_ia?: string;
    score_fiabilite?: number;
    rapport_ia?: Record<string, unknown>;
    texte_extrait?: string;
  }
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('publications')
    .update(patch)
    .eq('id', id);

  if (error) throwDbError(error);
}

export async function updateAudioUrl(id: string, audioUrl: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('publications')
    .update({ audio_url: audioUrl })
    .eq('id', id);

  if (error) throwDbError(error);
}

export async function incrementVues(id: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_vues', { pub_id: id });
  // Fallback si la fonction RPC n'existe pas encore
  if (error) {
    await supabaseAdmin
      .from('publications')
      .update({ vues_count: supabaseAdmin.rpc('increment_vues', { pub_id: id }) as unknown as number })
      .eq('id', id);
  }
}

export async function incrementTelechargements(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('publications')
    .select('telechargements_count')
    .eq('id', id)
    .single()
    .then(async ({ data }) => {
      if (!data) return { error: null };
      return supabaseAdmin
        .from('publications')
        .update({ telechargements_count: (data as PublicationRow).telechargements_count + 1 })
        .eq('id', id);
    });

  if (error) throwDbError(error);
}

// ── Suppression ───────────────────────────────────────────────────────────────

export async function deletePublication(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('publications')
    .delete()
    .eq('id', id);

  if (error) throwDbError(error);
}

// ── Signalements ─────────────────────────────────────────────────────────────

export async function createSignalement(input: {
  publication_id: string;
  source: 'ia' | 'utilisateur';
  motif?: MotifSignalement;
  description?: string;
  signale_par?: string;
  signale_role?: string;
}): Promise<void> {
  const { error } = await supabaseAdmin
    .from('signalements')
    .insert(input);

  if (error) throwDbError(error);
}

export async function findSignalements(params: {
  statut?: string;
  cursor?: string;
  limit: number;
}): Promise<SignalementRow[]> {
  let query = supabaseAdmin
    .from('signalements')
    .select('*, publication:publications(id, titre, professeur_id)')
    .order('created_at', { ascending: false })
    .limit(params.limit + 1);

  if (params.statut) query = query.eq('statut', params.statut);
  if (params.cursor) query = query.lt('created_at', params.cursor);

  const { data, error } = await query.returns<SignalementRow[]>();
  if (error) throwDbError(error);
  return data ?? [];
}

export async function updateSignalementStatut(
  id: string,
  statut: 'supprime' | 'innocente' | 'averti',
  traitePar: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('signalements')
    .update({ statut, traite_par: traitePar, traite_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throwDbError(error);
}

// ── Partages ──────────────────────────────────────────────────────────────────

export async function createPartage(input: {
  publication_id: string;
  token: string;
  created_by: string;
}): Promise<PartageRow> {
  const { data, error } = await supabaseAdmin
    .from('partages')
    .insert(input)
    .select()
    .single<PartageRow>();

  if (error) throwDbError(error);
  return data!;
}

export async function findPartageByToken(token: string): Promise<PartageRow | null> {
  const { data, error } = await supabaseAdmin
    .from('partages')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle<PartageRow>();

  if (error) throwDbError(error);
  return data;
}

// ── Historique ────────────────────────────────────────────────────────────────

export async function createHistorique(input: {
  publication_id: string;
  etudiant_id: string;
  type_action: 'vue' | 'telecharge' | 'ecoute';
}): Promise<void> {
  const { error } = await supabaseAdmin
    .from('historique_lecture')
    .insert(input);

  if (error) throwDbError(error);
}

export async function findHistoriqueByEtudiant(
  etudiantId: string,
  cursor?: string,
  limit = 20
): Promise<HistoriqueLectureRow[]> {
  let query = supabaseAdmin
    .from('historique_lecture')
    .select('*, publication:publications(id, titre, matiere, niveau, type_doc, pdf_url, likes_count, telechargements_count, vues_count, created_at)')
    .eq('etudiant_id', etudiantId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query.returns<HistoriqueLectureRow[]>();
  if (error) throwDbError(error);
  return data ?? [];
}

/** Favoris d'un utilisateur */
export async function findFavoris(
  userId: string,
  cursor?: string,
  limit = 20
): Promise<PublicationWithRelations[]> {
  let query = supabaseAdmin
    .from('favoris')
    .select(`publication:publications(*, professeur:professeurs(id, nom_complet, photo_url), universite:universites(id, nom_officiel, logo_url))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) throwDbError(error);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data as any[]) ?? []).map((row: any) => row.publication).filter(Boolean);
}

/** Pack offline — publications légères depuis une date */
export async function findFeedPackSince(since?: string, limit = 50): Promise<Partial<PublicationRow>[]> {
  let query = supabaseAdmin
    .from('publications')
    .select('id, titre, matiere, niveau, type_doc, pdf_url, resume_ia, score_fiabilite, likes_count, telechargements_count, vues_count, created_at')
    .eq('statut_moderation', 'validee')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (since) query = query.gte('created_at', since);

  const { data, error } = await query;
  if (error) throwDbError(error);
  return (data as Partial<PublicationRow>[]) ?? [];
}
