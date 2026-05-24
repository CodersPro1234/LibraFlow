import * as interactionsRepo from '../repositories/interactions.repository';
import * as notifRepo from '../repositories/notification.repository';
import * as pubRepo from '../repositories/publications.repository';
import { ConflictError, ForbiddenError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';
import type { Role } from '../types';
import type { AbonnementRow, CommentaireRow } from '../types/db';
import type { CommentaireWithUser } from '../repositories/interactions.repository';

// ── Likes ─────────────────────────────────────────────────────────────────────

export async function likePublication(publicationId: string, userId: string, userRole: string): Promise<void> {
  const pub = await pubRepo.findById(publicationId);
  if (!pub) throw new NotFoundError('Publication');

  const existing = await interactionsRepo.findLike(publicationId, userId);
  if (existing) throw new ConflictError('Vous avez déjà liké cette publication');

  await interactionsRepo.addLike(publicationId, userId, userRole);

  // Notifier le professeur (fire-and-forget)
  void notifRepo.createNotification({
    destinataire_id: pub.professeur_id,
    destinataire_role: 'professeur',
    type: 'nouveau_like',
    titre: 'Nouveau like',
    message: `Votre publication "${pub.titre}" a reçu un nouveau like.`,
    lien: `/publications/${publicationId}`,
  });

  logger.info({ publicationId, userId }, 'Like ajouté');
}

export async function unlikePublication(publicationId: string, userId: string): Promise<void> {
  const pub = await pubRepo.findById(publicationId);
  if (!pub) throw new NotFoundError('Publication');

  await interactionsRepo.removeLike(publicationId, userId);
  logger.info({ publicationId, userId }, 'Like retiré');
}

// ── Commentaires ──────────────────────────────────────────────────────────────

export async function getCommentaires(
  publicationId: string,
  cursor?: string
): Promise<{ data: CommentaireWithUser[]; cursor_next: string | null; has_more: boolean }> {
  const pub = await pubRepo.findById(publicationId);
  if (!pub) throw new NotFoundError('Publication');

  const rows = await interactionsRepo.findCommentaires({ publicationId, cursor, limit: 20 });
  const has_more = rows.length > 20;
  if (has_more) rows.pop();
  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;

  return { data: rows, cursor_next, has_more };
}

export async function postCommentaire(params: {
  publicationId: string;
  userId: string;
  userRole: string;
  contenu: string;
  parentId?: string;
}): Promise<CommentaireWithUser> {
  const pub = await pubRepo.findById(params.publicationId);
  if (!pub) throw new NotFoundError('Publication');

  const commentaire = await interactionsRepo.createCommentaire({
    publication_id: params.publicationId,
    user_id: params.userId,
    user_role: params.userRole,
    contenu: params.contenu,
    parent_id: params.parentId,
  });

  const isReply = !!params.parentId;

  // Notifier le professeur (ou l'auteur du commentaire parent si réponse)
  if (isReply && params.parentId) {
    const parent = await interactionsRepo.findCommentaireById(params.parentId);
    if (parent && parent.user_id !== params.userId) {
      void notifRepo.createNotification({
        destinataire_id: parent.user_id,
        destinataire_role: parent.user_role as Role,
        type: 'reponse_commentaire',
        titre: 'Réponse à votre commentaire',
        message: `Quelqu'un a répondu à votre commentaire sur "${pub.titre}".`,
        lien: `/publications/${params.publicationId}`,
      });
    }
  } else if (pub.professeur_id !== params.userId) {
    void notifRepo.createNotification({
      destinataire_id: pub.professeur_id,
      destinataire_role: 'professeur',
      type: 'nouveau_commentaire',
      titre: 'Nouveau commentaire',
      message: `Votre publication "${pub.titre}" a reçu un commentaire.`,
      lien: `/publications/${params.publicationId}`,
    });
  }

  logger.info({ publicationId: params.publicationId, userId: params.userId }, 'Commentaire posté');

  return commentaire;
}

export async function deleteCommentaire(id: string, requesterId: string, requesterRole: string): Promise<void> {
  const commentaire = await interactionsRepo.findCommentaireById(id);
  if (!commentaire) throw new NotFoundError('Commentaire');

  const isAuthor = commentaire.user_id === requesterId;
  const isAdmin = requesterRole === 'universite' || requesterRole === 'ministere';

  if (!isAuthor && !isAdmin) throw new ForbiddenError('Non autorisé à supprimer ce commentaire');

  await interactionsRepo.deleteCommentaire(id);
  logger.info({ commentaireId: id, requesterId }, 'Commentaire supprimé');
}

// ── Favoris ───────────────────────────────────────────────────────────────────

export async function savePublication(publicationId: string, userId: string, userRole: string): Promise<void> {
  const pub = await pubRepo.findById(publicationId);
  if (!pub) throw new NotFoundError('Publication');

  const existing = await interactionsRepo.findFavori(publicationId, userId);
  if (existing) throw new ConflictError('Publication déjà sauvegardée');

  await interactionsRepo.addFavori(publicationId, userId, userRole);
  logger.info({ publicationId, userId }, 'Publication sauvegardée');
}

export async function unsavePublication(publicationId: string, userId: string): Promise<void> {
  const pub = await pubRepo.findById(publicationId);
  if (!pub) throw new NotFoundError('Publication');

  await interactionsRepo.removeFavori(publicationId, userId);
  logger.info({ publicationId, userId }, 'Publication retirée des favoris');
}

// ── Abonnements ───────────────────────────────────────────────────────────────

export async function followProfesseur(
  followerId: string,
  followerRole: string,
  professeurId: string
): Promise<void> {
  const existing = await interactionsRepo.findAbonnement(followerId, professeurId, 'professeur');
  if (existing) throw new ConflictError('Vous suivez déjà ce professeur');

  // Vérifier que le professeur existe
  const { data: prof } = await (await import('../config/supabase')).supabaseAdmin
    .from('professeurs')
    .select('id, nom_complet')
    .eq('id', professeurId)
    .maybeSingle();

  if (!prof) throw new NotFoundError('Professeur');

  await interactionsRepo.addAbonnement(followerId, followerRole, professeurId, 'professeur');

  void notifRepo.createNotification({
    destinataire_id: professeurId,
    destinataire_role: 'professeur',
    type: 'nouveau_abonne',
    titre: 'Nouvel abonné',
    message: 'Quelqu\'un s\'est abonné à votre profil.',
    lien: '/community',
  });

  logger.info({ followerId, professeurId }, 'Abonnement professeur ajouté');
}

export async function unfollowProfesseur(followerId: string, professeurId: string): Promise<void> {
  await interactionsRepo.removeAbonnement(followerId, professeurId, 'professeur');
  logger.info({ followerId, professeurId }, 'Abonnement professeur retiré');
}

export async function followUniversite(
  followerId: string,
  followerRole: string,
  universiteId: string
): Promise<void> {
  const existing = await interactionsRepo.findAbonnement(followerId, universiteId, 'universite');
  if (existing) throw new ConflictError('Vous suivez déjà cette université');

  const { data: univ } = await (await import('../config/supabase')).supabaseAdmin
    .from('universites')
    .select('id')
    .eq('id', universiteId)
    .maybeSingle();

  if (!univ) throw new NotFoundError('Université');

  await interactionsRepo.addAbonnement(followerId, followerRole, universiteId, 'universite');
  logger.info({ followerId, universiteId }, 'Abonnement université ajouté');
}

export async function unfollowUniversite(followerId: string, universiteId: string): Promise<void> {
  await interactionsRepo.removeAbonnement(followerId, universiteId, 'universite');
  logger.info({ followerId, universiteId }, 'Abonnement université retiré');
}

// ── Communauté du professeur ──────────────────────────────────────────────────

export async function getCommunaute(professeurId: string): Promise<{
  abonnes: AbonnementRow[];
  total_abonnes: number;
  commentaires_recents: CommentaireRow[];
  likes_recents: never[];
}> {
  const [abonnes, totalAbonnes, commentairesRecents] = await Promise.all([
    interactionsRepo.findAbonnes(professeurId, 'professeur', 20),
    interactionsRepo.findAbonnesCount(professeurId, 'professeur'),
    interactionsRepo.findRecentCommentairesByProfesseur(professeurId, 10),
  ]);

  return {
    abonnes,
    total_abonnes: totalAbonnes,
    commentaires_recents: commentairesRecents,
    likes_recents: [],
  };
}
