import type { Request, Response } from 'express';
import * as univService from '../services/universite.service';
import type { MotifInput } from '../validators/universite.validators';

function getUniversiteId(req: Request): string {
  return req.user!.id;
}

/** PATCH /api/v1/universite/professeurs/:id/valider */
export async function validerProfesseur(req: Request, res: Response): Promise<void> {
  const universiteId = getUniversiteId(req);
  const { id } = req.params as { id: string };
  await univService.validerProfesseur(universiteId, id);
  res.json({ message: 'Professeur validé avec succès. Notification envoyée.' });
}

/** PATCH /api/v1/universite/professeurs/:id/rejeter */
export async function rejeterProfesseur(req: Request, res: Response): Promise<void> {
  const universiteId = getUniversiteId(req);
  const { id } = req.params as { id: string };
  const { motif } = req.body as MotifInput;
  await univService.rejeterProfesseur(universiteId, id, motif);
  res.json({ message: 'Professeur rejeté. Notification envoyée.' });
}

/** PATCH /api/v1/universite/professeurs/:id/suspendre */
export async function suspendreProfesseur(req: Request, res: Response): Promise<void> {
  const universiteId = getUniversiteId(req);
  const { id } = req.params as { id: string };
  const { motif } = req.body as MotifInput;
  await univService.suspendreProfesseur(universiteId, id, motif);
  res.json({ message: 'Professeur suspendu. Notification envoyée.' });
}
