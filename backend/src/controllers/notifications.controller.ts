import type { Request, Response } from 'express';
import * as notifService from '../services/notifications.service';

/** GET /api/v1/notifications */
export async function getNotifications(req: Request, res: Response): Promise<void> {
  const { lu, cursor } = req.query as { lu?: string; cursor?: string };
  const luBool = lu === 'true' ? true : lu === 'false' ? false : undefined;

  const result = await notifService.getNotifications({
    userId: req.user!.id,
    lu: luBool,
    cursor,
  });

  res.json(result);
}

/** GET /api/v1/notifications/unread/count */
export async function getUnreadCount(req: Request, res: Response): Promise<void> {
  const count = await notifService.getUnreadCount(req.user!.id);
  res.json({ count });
}

/** PATCH /api/v1/notifications/:id/read */
export async function markAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await notifService.markAsRead(id, req.user!.id);
  res.status(204).send();
}

/** PATCH /api/v1/notifications/read-all */
export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  await notifService.markAllAsRead(req.user!.id);
  res.status(204).send();
}
