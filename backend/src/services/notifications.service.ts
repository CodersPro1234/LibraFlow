import { supabaseAdmin } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';
import type { NotificationRow } from '../types/db';

function throwDbError(error: { message: string }): never {
  throw new AppError(`Erreur base de données : ${error.message}`, 500, 'DB_ERROR', undefined, false);
}

export async function getNotifications(params: {
  userId: string;
  lu?: boolean;
  cursor?: string;
  limit?: number;
}): Promise<{ data: NotificationRow[]; unread_count: number; cursor_next: string | null; has_more: boolean }> {
  const limit = params.limit ?? 20;

  let query = supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('destinataire_id', params.userId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (params.lu !== undefined) query = query.eq('lu', params.lu);
  if (params.cursor) query = query.lt('created_at', params.cursor);

  const { data, error } = await query.returns<NotificationRow[]>();
  if (error) throwDbError(error);

  const rows = data ?? [];
  const has_more = rows.length > limit;
  if (has_more) rows.pop();

  const cursor_next = has_more && rows.length > 0 ? rows[rows.length - 1]!.created_at : null;

  // Compter les non-lues séparément
  const { count: unreadCount, error: countError } = await supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('destinataire_id', params.userId)
    .eq('lu', false);

  if (countError) throwDbError(countError);

  return { data: rows, unread_count: unreadCount ?? 0, cursor_next, has_more };
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('destinataire_id', userId)
    .eq('lu', false);

  if (error) throwDbError(error);
  return count ?? 0;
}

export async function markAsRead(id: string, userId: string): Promise<void> {
  const { data, error: fetchError } = await supabaseAdmin
    .from('notifications')
    .select('id, destinataire_id')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) throwDbError(fetchError);
  if (!data) throw new NotFoundError('Notification');
  if ((data as { destinataire_id: string }).destinataire_id !== userId) {
    throw new AppError('Non autorisé', 403, 'FORBIDDEN');
  }

  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ lu: true })
    .eq('id', id);

  if (error) throwDbError(error);
}

export async function markAllAsRead(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ lu: true })
    .eq('destinataire_id', userId)
    .eq('lu', false);

  if (error) throwDbError(error);
}
