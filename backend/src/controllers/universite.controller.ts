import type { Request, Response } from 'express';
import * as univService from '../services/universite.service';
import { AppError } from '../utils/errors';
import type { MotifInput } from '../validators/universite.validators';

function getUniversiteId(req: Request): string {
  return req.user!.id;
}

/** GET /api/v1/universite/dashboard */
export async function getDashboard(req: Request, res: Response): Promise<void> {
  const data = await univService.getDashboard(getUniversiteId(req));
  res.json(data);
}

/** GET /api/v1/universite/professeurs */
export async function listProfesseurs(req: Request, res: Response): Promise<void> {
  const { statut, cursor, limit } = req.query as { statut?: string; cursor?: string; limit?: string };
  const result = await univService.listProfesseurs({
    universiteId: getUniversiteId(req),
    statut,
    cursor,
    limit: Math.min(parseInt(limit ?? '20', 10), 100),
  });
  res.json(result);
}

/** GET /api/v1/universite/etudiants */
export async function listEtudiants(req: Request, res: Response): Promise<void> {
  const { cursor, limit } = req.query as { cursor?: string; limit?: string };
  const result = await univService.listEtudiants({
    universiteId: getUniversiteId(req),
    cursor,
    limit: Math.min(parseInt(limit ?? '20', 10), 100),
  });
  res.json(result);
}

/** PATCH /api/v1/universite/etudiants/:id/suspendre */
export async function suspendreEtudiant(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { motif } = req.body as MotifInput;
  await univService.suspendreEtudiant(getUniversiteId(req), id, motif);
  res.json({ message: 'Étudiant suspendu. ' });
}

/** GET /api/v1/universite/publications */
export async function listPublications(req: Request, res: Response): Promise<void> {
  const { cursor, limit } = req.query as { cursor?: string; limit?: string };
  const result = await univService.listPublications({
    universiteId: getUniversiteId(req),
    cursor,
    limit: Math.min(parseInt(limit ?? '20', 10), 100),
  });
  res.json(result);
}

/** GET /api/v1/universite/publications/:id */
export async function getPublication(req: Request, res: Response): Promise<void> {
  const { supabaseAdmin } = await import('../config/supabase');
  const { id } = req.params as { id: string };
  const universiteId = getUniversiteId(req);

  const { data, error } = await supabaseAdmin
    .from('publications')
    .select('*, professeur:professeurs(id, nom_complet, photo_url), universite:universites(id, nom_officiel)')
    .eq('id', id)
    .eq('universite_id', universiteId)
    .maybeSingle();

  if (error) throw new AppError(error.message, 500, 'DB_ERROR', undefined, false);
  if (!data) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Publication non trouvée' } });
    return;
  }
  res.json(data);
}

/** PATCH /api/v1/universite/etudiants/:id/reactiver */
export async function reactiverEtudiant(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await univService.reactiverEtudiant(getUniversiteId(req), id);
  res.json({ message: 'Étudiant réactivé.' });
}

/** DELETE /api/v1/universite/publications/:id/supprimer */
export async function supprimerPublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await univService.supprimerPublication(getUniversiteId(req), id);
  res.status(204).send();
}

/** GET /api/v1/universite/top */
export async function getTopPublications(req: Request, res: Response): Promise<void> {
  const data = await univService.getTopPublications(getUniversiteId(req));
  res.json({ data });
}

/** GET /api/v1/universite/evolution-mensuelle */
export async function getEvolutionMensuelle(req: Request, res: Response): Promise<void> {
  const data = await univService.getEvolutionMensuelle(getUniversiteId(req));
  res.json({ data });
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
