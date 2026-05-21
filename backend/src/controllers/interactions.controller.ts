import type { Request, Response } from 'express';
import * as interactionsService from '../services/interactions.service';
import type { PostCommentaireInput } from '../validators/interactions.validators';

/** POST /api/v1/publications/:id/like */
export async function likePublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.likePublication(id, req.user!.id, req.user!.role);
  res.status(201).json({ message: 'Liké' });
}

/** DELETE /api/v1/publications/:id/like */
export async function unlikePublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.unlikePublication(id, req.user!.id);
  res.status(204).send();
}

/** GET /api/v1/publications/:id/comments */
export async function getCommentaires(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { cursor } = req.query as { cursor?: string };
  const result = await interactionsService.getCommentaires(id, cursor);
  res.json(result);
}

/** POST /api/v1/publications/:id/comments */
export async function postCommentaire(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { contenu, parent_id } = req.body as PostCommentaireInput;

  const commentaire = await interactionsService.postCommentaire({
    publicationId: id,
    userId: req.user!.id,
    userRole: req.user!.role,
    contenu,
    parentId: parent_id,
  });

  res.status(201).json(commentaire);
}

/** DELETE /api/v1/comments/:id */
export async function deleteCommentaire(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.deleteCommentaire(id, req.user!.id, req.user!.role);
  res.status(204).send();
}

/** POST /api/v1/publications/:id/save */
export async function savePublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.savePublication(id, req.user!.id, req.user!.role);
  res.status(201).json({ message: 'Sauvegardé' });
}

/** DELETE /api/v1/publications/:id/save */
export async function unsavePublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.unsavePublication(id, req.user!.id);
  res.status(204).send();
}

/** POST /api/v1/follow/professeur/:id */
export async function followProfesseur(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.followProfesseur(req.user!.id, req.user!.role, id);
  res.status(201).json({ message: 'Abonné' });
}

/** DELETE /api/v1/follow/professeur/:id */
export async function unfollowProfesseur(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.unfollowProfesseur(req.user!.id, id);
  res.status(204).send();
}

/** POST /api/v1/follow/universite/:id */
export async function followUniversite(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.followUniversite(req.user!.id, req.user!.role, id);
  res.status(201).json({ message: 'Abonné' });
}

/** DELETE /api/v1/follow/universite/:id */
export async function unfollowUniversite(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await interactionsService.unfollowUniversite(req.user!.id, id);
  res.status(204).send();
}
