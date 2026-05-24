import type { Request, Response } from 'express';
import * as interactionsService from '../services/interactions.service';
import * as pubService from '../services/publications.service';
import logger from '../utils/logger';

interface OfflineAction {
  type: 'like' | 'unlike' | 'comment' | 'follow' | 'unfollow' | 'save' | 'unsave' | 'history_update';
  payload: Record<string, unknown>;
  client_timestamp: string;
}

/** POST /api/v1/sync/pending-actions */
export async function syncPendingActions(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { actions } = req.body as { actions: OfflineAction[] };

  const processed: string[] = [];
  const failed: Array<{ action: OfflineAction; error: string }> = [];

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'like':
          await interactionsService.likePublication(
            action.payload['publication_id'] as string,
            user.id,
            user.role
          );
          break;
        case 'unlike':
          await interactionsService.unlikePublication(
            action.payload['publication_id'] as string,
            user.id
          );
          break;
        case 'comment':
          await interactionsService.postCommentaire({
            publicationId: action.payload['publication_id'] as string,
            userId: user.id,
            userRole: user.role,
            contenu: action.payload['contenu'] as string,
            parentId: action.payload['parent_id'] as string | undefined,
          });
          break;
        case 'save':
          await interactionsService.savePublication(
            action.payload['publication_id'] as string,
            user.id,
            user.role
          );
          break;
        case 'unsave':
          await interactionsService.unsavePublication(
            action.payload['publication_id'] as string,
            user.id
          );
          break;
        case 'follow':
          if (action.payload['cible_type'] === 'professeur') {
            await interactionsService.followProfesseur(user.id, user.role, action.payload['cible_id'] as string);
          } else {
            await interactionsService.followUniversite(user.id, user.role, action.payload['cible_id'] as string);
          }
          break;
        case 'unfollow':
          if (action.payload['cible_type'] === 'professeur') {
            await interactionsService.unfollowProfesseur(user.id, action.payload['cible_id'] as string);
          } else {
            await interactionsService.unfollowUniversite(user.id, action.payload['cible_id'] as string);
          }
          break;
        default:
          break;
      }
      processed.push(action.type);
    } catch (err) {
      logger.warn({ action, err }, 'Action offline ignorée (doublon ou erreur)');
      // Les conflits (doublon like/save) sont ignorés silencieusement
      const errMsg = err instanceof Error ? err.message : String(err);
      if (!errMsg.includes('Conflit') && !errMsg.includes('déjà')) {
        failed.push({ action, error: errMsg });
      } else {
        processed.push(action.type);
      }
    }
  }

  res.json({ processed, failed });
}

/** GET /api/v1/offline/feed-pack */
export async function getOfflineFeedPack(req: Request, res: Response): Promise<void> {
  const { since } = req.query as { since?: string };
  const data = await pubService.getOfflineFeedPack(since);
  res.json({ data });
}
