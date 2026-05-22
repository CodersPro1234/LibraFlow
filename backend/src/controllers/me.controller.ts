import type { Request, Response } from 'express';
import * as meService from '../services/me.service';
import * as pubService from '../services/publications.service';
import * as interactionsService from '../services/interactions.service';
import type { ChangePasswordInput } from '../validators/me.validators';

/** GET /api/v1/me */
export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const profile = await meService.getProfile(user.id, user.role);
  res.json(profile);
}

/** PATCH /api/v1/me */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const file = req.file;

  let matieres: string[] | undefined;
  if (req.body.matieres) {
    try {
      matieres = JSON.parse(req.body.matieres as string) as string[];
    } catch {
      matieres = undefined;
    }
  }

  await meService.updateProfile(user.id, user.role, {
    nom_complet: req.body.nom_complet as string | undefined,
    matieres,
    photoBuffer: file?.buffer,
    photoMimetype: file?.mimetype,
    photoOriginalname: file?.originalname,
  });

  res.json({ message: 'Profil mis à jour' });
}

/** POST /api/v1/me/password */
export async function changePassword(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { current_password, new_password } = req.body as ChangePasswordInput;
  await meService.changePassword(user.id, user.role, current_password, new_password);
  res.status(204).send();
}

/** GET /api/v1/me/publications */
export async function getMesPublications(req: Request, res: Response): Promise<void> {
  const { cursor } = req.query as { cursor?: string };
  const result = await pubService.getMesPublications(req.user!.id, cursor);
  res.json(result);
}

/** GET /api/v1/me/community */
export async function getMaCommunaute(req: Request, res: Response): Promise<void> {
  const result = await interactionsService.getCommunaute(req.user!.id);
  res.json(result);
}

/** GET /api/v1/me/recommendations */
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  const data = await pubService.getRecommendations(req.user!.id);
  res.json({ data });
}

/** GET /api/v1/me/library */
export async function getBibliotheque(req: Request, res: Response): Promise<void> {
  const result = await pubService.getBibliotheque(req.user!.id);
  res.json(result);
}

/** GET /api/v1/me/publications/stats */
export async function getMesPublicationsStats(req: Request, res: Response): Promise<void> {
  const data = await meService.getMesPublicationsStats(req.user!.id);
  res.json(data);
}

/** GET /api/v1/me/history */
export async function getHistorique(req: Request, res: Response): Promise<void> {
  const { cursor } = req.query as { cursor?: string };
  const result = await meService.getHistorique(req.user!.id, cursor);
  res.json(result);
}

/** POST /api/v1/me/history */
export async function addHistorique(req: Request, res: Response): Promise<void> {
  const { publication_id, type_action } = req.body as { publication_id: string; type_action?: 'vue' | 'telecharge' | 'ecoute' };
  await meService.addHistorique(req.user!.id, publication_id, type_action ?? 'vue');
  res.status(204).send();
}

/** GET /api/v1/me/downloads */
export async function getDownloads(req: Request, res: Response): Promise<void> {
  const { cursor } = req.query as { cursor?: string };
  const result = await meService.getDownloads(req.user!.id, cursor);
  res.json(result);
}

/** GET /api/v1/me/abonnes — professeur uniquement */
export async function getAbonnes(req: Request, res: Response): Promise<void> {
  const { cursor } = req.query as { cursor?: string };
  const result = await meService.getAbonnes(req.user!.id, cursor);
  res.json(result);
}

/** GET /api/v1/me/interactions-recentes — professeur uniquement */
export async function getInteractionsRecentes(req: Request, res: Response): Promise<void> {
  const data = await meService.getInteractionsRecentes(req.user!.id);
  res.json(data);
}
