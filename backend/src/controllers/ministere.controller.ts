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
