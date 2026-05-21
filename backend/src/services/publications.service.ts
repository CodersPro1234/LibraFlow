import crypto from 'crypto';
import pdfParse from 'pdf-parse';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import redis from '../config/redis';
import * as pubRepo from '../repositories/publications.repository';
import * as interactionsRepo from '../repositories/interactions.repository';
import { moderationQueue, ttsQueue } from '../jobs/queues';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import type { NiveauPublication, TypeDoc, MotifSignalement } from '../types/db';
import type { PublicationWithRelations } from '../repositories/publications.repository';

// ── Création / upload ─────────────────────────────────────────────────────────

export interface CreatePublicationInput {
  titre: string;
  matiere: string;
  niveau: NiveauPublication;
  type_doc: TypeDoc;
  description?: string;
  fichierBuffer: Buffer;
  fichierOriginalName: string;
  fichierSize: number;
  professeurId: string;
  universiteId: string;
}

export async function createPublication(input: CreatePublicationInput): Promise<{ id: string; statut: string; message: string }> {
  const storagePath = `publications/${input.professeurId}/${Date.now()}_${input.fichierOriginalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  // Extraire le texte du PDF avant l'upload (seulement pour les PDF)
  let texteExtrait: string | undefined;
  if (input.fichierOriginalName.toLowerCase().endsWith('.pdf')) {
    try {
      const parsed = await pdfParse(input.fichierBuffer);
      texteExtrait = parsed.text.slice(0, 10_000).trim() || undefined;
    } catch (err) {
      logger.warn({ err }, 'Extraction texte PDF échouée — on continue sans texte_extrait');
    }
  }

  const { error: uploadError } = await supabaseAdmin.storage
    .from('documents')
    .upload(storagePath, input.fichierBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadError) {
    throw new ValidationError(`Erreur upload fichier : ${uploadError.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('documents')
    .getPublicUrl(storagePath);

  const pub = await pubRepo.createPublication({
    professeur_id: input.professeurId,
    universite_id: input.universiteId,
    titre: input.titre,
    matiere: input.matiere,
    niveau: input.niveau,
    type_doc: input.type_doc,
    description: input.description,
    pdf_url: urlData.publicUrl,
    pdf_size_bytes: input.fichierSize,
    texte_extrait: texteExtrait,
  });

  // Enqueue analyse IA avec le texte extrait
  await moderationQueue.add('moderate', {
    publication_id: pub.id,
    titre: pub.titre,
    matiere: pub.matiere,
    texte_extrait: pub.texte_extrait ?? pub.titre,
  });

  logger.info({ publicationId: pub.id, professeurId: input.professeurId }, 'Publication créée, analyse en attente');

  return {
    id: pub.id,
    statut: 'en_analyse',
    message: 'Document reçu, analyse IA en cours. Vous serez notifié du résultat.',
  };
}

// ── Lecture ───────────────────────────────────────────────────────────────────

export async function getPublication(
  id: string,
  requesterId?: string,
  _requesterRole?: string
): Promise<PublicationWithRelations & { is_liked: boolean; is_saved: boolean }> {
  const pub = await pubRepo.findByIdWithRelations(id);
  if (!pub) throw new NotFoundError('Publication');

  // Incrémenter les vues (fire-and-forget)
  void supabaseAdmin
    .from('publications')
    .update({ vues_count: pub.vues_count + 1 })
    .eq('id', id)
    .then();

  let is_liked = false;
  let is_saved = false;

  if (requesterId) {
    const [liked, saved] = await Promise.all([
      interactionsRepo.isLiked(id, requesterId),
      interactionsRepo.findFavori(id, requesterId).then((f) => f !== null),
    ]);
    is_liked = liked;
    is_saved = saved;
  }

  return { ...pub, is_liked, is_saved };
}

export async function getFeed(params: {
  requesterId: string;
  requesterRole: string;
  cursor?: string;
  limit: number;
}): Promise<{ data: (PublicationWithRelations & { is_liked: boolean; is_saved: boolean })[]; cursor_next: string | null; has_more: boolean }> {
  // Récupérer les IDs des entités suivies
  const [profIds, univIds] = await Promise.all([
    interactionsRepo.findCiblesIdsByFollower(params.requesterId, 'professeur'),
    interactionsRepo.findCiblesIdsByFollower(params.requesterId, 'universite'),
  ]);

  let rows: PublicationWithRelations[];

  if (profIds.length === 0 && univIds.length === 0) {
    // Aucun abonnement → feed global
    rows = await pubRepo.findGlobalFeed({ cursor: params.cursor, limit: params.limit });
  } else {
    // Combiner feed professeurs + universités puis trier
    const [feedProfs, feedUnivsRaw] = await Promise.all([
      profIds.length > 0
        ? pubRepo.findFeed({ followerIds: profIds, followerType: 'professeur', cursor: params.cursor, limit: params.limit })
        : Promise.resolve([] as PublicationWithRelations[]),
      univIds.length > 0
        ? pubRepo.findFeed({ followerIds: univIds, followerType: 'universite', cursor: params.cursor, limit: params.limit })
        : Promise.resolve([] as PublicationWithRelations[]),
    ]);

    const merged = [...feedProfs, ...feedUnivsRaw];
    const unique = new Map(merged.map((p) => [p.id, p]));
    rows = Array.from(unique.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, params.limit + 1);
  }

  const has_more = rows.length > params.limit;
  if (has_more) rows.pop();

  const publicationIds = rows.map((r) => r.id);
  const [likedSet, savedSet] = publicationIds.length > 0
    ? await Promise.all([
        interactionsRepo.isLikedBatch(publicationIds, params.requesterId),
        interactionsRepo.isSavedBatch(publicationIds, params.requesterId),
      ])
    : [new Set<string>(), new Set<string>()];

  const data = rows.map((r) => ({
    ...r,
    is_liked: likedSet.has(r.id),
    is_saved: savedSet.has(r.id),
  }));

  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;

  return { data, cursor_next, has_more };
}

export async function searchPublications(params: {
  q?: string;
  universite_id?: string;
  matiere?: string;
  niveau?: NiveauPublication;
  type_doc?: TypeDoc;
  date_from?: string;
  date_to?: string;
  page: number;
  limit: number;
}): Promise<{ data: unknown[]; total: number; page: number; limit: number }> {
  const offset = (params.page - 1) * params.limit;

  const results = await pubRepo.searchPublications({ ...params, offset });

  return {
    data: results,
    total: results.length,
    page: params.page,
    limit: params.limit,
  };
}

// ── Modification ──────────────────────────────────────────────────────────────

export async function updatePublication(
  id: string,
  requesterId: string,
  patch: { titre?: string; description?: string }
): Promise<void> {
  const pub = await pubRepo.findById(id);
  if (!pub) throw new NotFoundError('Publication');
  if (pub.professeur_id !== requesterId) throw new ForbiddenError("Vous n'êtes pas l'auteur de cette publication");

  await pubRepo.updatePublication(id, patch);
}

// ── Suppression ───────────────────────────────────────────────────────────────

export async function deletePublication(
  id: string,
  requesterId: string,
  requesterRole: string
): Promise<void> {
  const pub = await pubRepo.findById(id);
  if (!pub) throw new NotFoundError('Publication');

  const isAuthor = pub.professeur_id === requesterId;
  const isAdmin = requesterRole === 'universite' || requesterRole === 'ministere';

  if (!isAuthor && !isAdmin) throw new ForbiddenError('Non autorisé à supprimer cette publication');

  // Supprimer le fichier du storage
  const storagePath = pub.pdf_url.split('/documents/')[1];
  if (storagePath) {
    await supabaseAdmin.storage.from('documents').remove([storagePath]);
  }

  await pubRepo.deletePublication(id);
  logger.info({ publicationId: id, requesterId, role: requesterRole }, 'Publication supprimée');
}

// ── Téléchargement signé ──────────────────────────────────────────────────────

export async function getDownloadUrl(id: string, _requesterId: string): Promise<{ download_url: string; expires_in: number }> {
  const pub = await pubRepo.findById(id);
  if (!pub) throw new NotFoundError('Publication');

  const storagePath = pub.pdf_url.split('/documents/')[1];
  if (!storagePath) throw new ValidationError('URL de fichier invalide');

  const expiresIn = 3600;
  const { data, error } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data) throw new ValidationError(`Impossible de générer le lien : ${error?.message}`);

  // Incrémenter les téléchargements (fire-and-forget)
  void pubRepo.incrementTelechargements(id);

  return { download_url: data.signedUrl, expires_in: expiresIn };
}

// ── TTS ───────────────────────────────────────────────────────────────────────

export async function requestTts(id: string): Promise<{ audio_url?: string; message?: string; ready: boolean }> {
  const pub = await pubRepo.findById(id);
  if (!pub) throw new NotFoundError('Publication');

  if (pub.audio_url) {
    return { audio_url: pub.audio_url, ready: true };
  }

  // Vérifier si un job est déjà en file d'attente
  const waitingJobs = await ttsQueue.getJobs(['waiting', 'active']);
  const alreadyQueued = waitingJobs.some((j) => j.data.publication_id === id);

  if (!alreadyQueued) {
    const texte = pub.resume_ia ?? pub.titre;
    await ttsQueue.add('generate-tts', { publication_id: id, texte });
  }

  return { message: 'Audio en cours de génération (30s environ).', ready: false };
}

// ── Signalement ───────────────────────────────────────────────────────────────

export async function signalerPublication(
  id: string,
  signalePar: string,
  signaleRole: string,
  motif: MotifSignalement,
  description?: string
): Promise<void> {
  const pub = await pubRepo.findById(id);
  if (!pub) throw new NotFoundError('Publication');

  await pubRepo.createSignalement({
    publication_id: id,
    source: 'utilisateur',
    motif,
    description,
    signale_par: signalePar,
    signale_role: signaleRole,
  });

  logger.info({ publicationId: id, signalePar, motif }, 'Publication signalée');
}

// ── Partage ───────────────────────────────────────────────────────────────────

export async function createShareLink(
  id: string,
  createdBy: string
): Promise<{ share_url: string; expires_at: string }> {
  const pub = await pubRepo.findById(id);
  if (!pub) throw new NotFoundError('Publication');

  const token = crypto.randomBytes(32).toString('hex');
  const partage = await pubRepo.createPartage({ publication_id: id, token, created_by: createdBy });

  const shareUrl = `${env.frontendUrl}/share/${partage.token}`;

  return { share_url: shareUrl, expires_at: partage.expires_at };
}

export async function getSharedPublication(token: string): Promise<PublicationWithRelations> {
  const partage = await pubRepo.findPartageByToken(token);
  if (!partage) throw new NotFoundError('Lien de partage invalide ou expiré');

  const pub = await pubRepo.findByIdWithRelations(partage.publication_id);
  if (!pub) throw new NotFoundError('Publication');

  return pub;
}

// ── Publications du professeur connecté ──────────────────────────────────────

export async function getMesPublications(professeurId: string, cursor?: string): Promise<{
  data: ReturnType<typeof pubRepo.findByProfesseur> extends Promise<infer T> ? T : never;
  cursor_next: string | null;
  has_more: boolean;
}> {
  const rows = await pubRepo.findByProfesseur(professeurId, cursor, 20);
  const has_more = rows.length > 20;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { data: rows as any, cursor_next, has_more };
}

// ── Recommandations IA ────────────────────────────────────────────────────────

const RECO_CACHE_TTL = 3600; // 1 heure
const recoKey = (id: string) => `reco:${id}`;

export async function getRecommendations(etudiantId: string): Promise<PublicationWithRelations[]> {
  // Vérifier le cache Redis
  const cached = await redis.get(recoKey(etudiantId));
  if (cached) {
    try {
      const ids = JSON.parse(cached) as string[];
      const pubs = await Promise.all(ids.map((id) => pubRepo.findByIdWithRelations(id)));
      return pubs.filter((p): p is PublicationWithRelations => p !== null);
    } catch {
      // Cache corrompu — on le supprime et on recalcule
      await redis.del(recoKey(etudiantId));
    }
  }

  // Appel service IA
  try {
    const { default: axios } = await import('axios');
    const historique = await pubRepo.findHistoriqueByEtudiant(etudiantId, undefined, 20);
    const ids = historique.map((h) => h.publication_id);

    const { data } = await axios.post<{ publication_ids: string[] }>(
      `${env.iaServiceUrl}/recommend`,
      { etudiant_id: etudiantId, historique: ids },
      { timeout: 10_000 }
    );

    const publicationIds = data.publication_ids;
    await redis.set(recoKey(etudiantId), JSON.stringify(publicationIds), 'EX', RECO_CACHE_TTL);

    const pubs = await Promise.all(publicationIds.map((id) => pubRepo.findByIdWithRelations(id)));
    return pubs.filter((p): p is PublicationWithRelations => p !== null);
  } catch {
    // Fallback : publications récentes
    return pubRepo.findGlobalFeed({ limit: 10 });
  }
}

// ── Pack offline ──────────────────────────────────────────────────────────────

export async function getOfflineFeedPack(since?: string) {
  return pubRepo.findFeedPackSince(since, 50);
}

// ── Bibliothèque étudiant ─────────────────────────────────────────────────────

export async function getBibliotheque(etudiantId: string) {
  const [favoris, historique] = await Promise.all([
    pubRepo.findFavoris(etudiantId),
    pubRepo.findHistoriqueByEtudiant(etudiantId, undefined, 20),
  ]);

  return { favoris, telecharges: [], historique };
}
