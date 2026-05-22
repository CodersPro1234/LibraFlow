import type { Request, Response } from 'express';
import * as minService from '../services/ministere.service';
import type { ApprouverInput, MotifInput } from '../validators/ministere.validators';

function getMinistereId(req: Request): string {
  return req.user!.id;
}

/** PATCH /api/v1/ministere/universites/:id/approuver */
export async function approuverUniversite(req: Request, res: Response): Promise<void> {
  const ministereId = getMinistereId(req);
  const { id } = req.params as { id: string };
  const { message } = req.body as ApprouverInput;
  await minService.approuverUniversite(ministereId, id, message);
  res.json({ message: 'Université approuvée. Notification envoyée.' });
}

/** PATCH /api/v1/ministere/universites/:id/rejeter */
export async function rejeterUniversite(req: Request, res: Response): Promise<void> {
  const ministereId = getMinistereId(req);
  const { id } = req.params as { id: string };
  const { motif } = req.body as MotifInput;
  await minService.rejeterUniversite(ministereId, id, motif);
  res.json({ message: 'Université rejetée. Notification envoyée.' });
}

/** PATCH /api/v1/ministere/universites/:id/suspendre */
export async function suspendreUniversite(req: Request, res: Response): Promise<void> {
  const ministereId = getMinistereId(req);
  const { id } = req.params as { id: string };
  const { motif } = req.body as MotifInput;
  await minService.suspendreUniversite(ministereId, id, motif);
  res.json({ message: 'Université suspendue. Notification envoyée.' });
}

/** PATCH /api/v1/ministere/universites/:id/reactiver */
export async function reactiverUniversite(req: Request, res: Response): Promise<void> {
  const ministereId = getMinistereId(req);
  const { id } = req.params as { id: string };
  await minService.reactiverUniversite(ministereId, id);
  res.json({ message: 'Université réactivée. Notification envoyée.' });
}

/** GET /api/v1/ministere/dashboard */
export async function getDashboard(_req: Request, res: Response): Promise<void> {
  const data = await minService.getDashboard();
  res.json(data);
}

/** GET /api/v1/ministere/universites */
export async function listUniversites(req: Request, res: Response): Promise<void> {
  const { statut, cursor, limit } = req.query as { statut?: string; cursor?: string; limit?: string };
  const result = await minService.listUniversites({
    statut,
    cursor,
    limit: Math.min(parseInt(limit ?? '20', 10), 100),
  });
  res.json(result);
}

/** GET /api/v1/ministere/universites/:id/dossier */
export async function getUniversiteDossier(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const data = await minService.getUniversiteDossier(id);
  res.json(data);
}

/** GET /api/v1/ministere/statistiques */
export async function getStatistiques(_req: Request, res: Response): Promise<void> {
  const data = await minService.getStatistiques();
  res.json(data);
}

/** GET /api/v1/ministere/carte */
export async function getCarte(_req: Request, res: Response): Promise<void> {
  const data = await minService.getCarte();
  res.json({ data });
}

/** GET /api/v1/ministere/statistiques-nationales */
export async function getStatistiquesNationales(_req: Request, res: Response): Promise<void> {
  const data = await minService.getStatistiquesNationales();
  res.json(data);
}

/** GET /api/v1/ministere/statistiques-nationales/region */
export async function getStatistiquesParRegion(_req: Request, res: Response): Promise<void> {
  const data = await minService.getStatistiquesParRegion();
  res.json({ data });
}

/** GET /api/v1/ministere/signalements */
export async function listSignalements(req: Request, res: Response): Promise<void> {
  const { cursor, limit } = req.query as { cursor?: string; limit?: string };
  const result = await minService.listSignalements({
    cursor,
    limit: Math.min(parseInt(limit ?? '20', 10), 100),
  });
  res.json(result);
}

/** DELETE /api/v1/ministere/signalements/:id/supprimer */
export async function supprimerSignalement(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await minService.traiterSignalement(id, getMinistereId(req), 'supprimer');
  res.status(204).send();
}

/** POST /api/v1/ministere/signalements/:id/innocenter */
export async function innocenterSignalement(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await minService.traiterSignalement(id, getMinistereId(req), 'innocenter');
  res.json({ message: 'Publication innocentée' });
}

/** POST /api/v1/ministere/signalements/:id/avertir */
export async function avertirSignalement(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await minService.traiterSignalement(id, getMinistereId(req), 'avertir');
  res.json({ message: 'Avertissement envoyé' });
}
