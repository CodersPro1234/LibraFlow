import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as notifService from '../src/services/notifications.service';
import { AppError, NotFoundError } from '../src/utils/errors';

const USER_ID  = 'user-111';
const NOTIF_ID = 'notif-222';
const OTHER_ID = 'other-333';

beforeEach(() => { vi.clearAllMocks(); });

// The supabase mock in setup.ts returns { data: null/[], error: null } by default.
// We import and re-configure it per test when needed.

// ── getNotifications ──────────────────────────────────────────────────────────

describe('getNotifications', () => {
  it('retourne une page vide par défaut', async () => {
    const result = await notifService.getNotifications({ userId: USER_ID, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('unread_count');
    expect(result).toHaveProperty('has_more');
    expect(result).toHaveProperty('cursor_next');
  });

  it('accepte le filtre lu=false', async () => {
    const result = await notifService.getNotifications({ userId: USER_ID, lu: false, limit: 20 });
    expect(result).toHaveProperty('data');
  });

  it('accepte un cursor de pagination', async () => {
    const result = await notifService.getNotifications({ userId: USER_ID, cursor: '2024-01-01', limit: 10 });
    expect(result).toHaveProperty('has_more');
  });
});

// ── getUnreadCount ────────────────────────────────────────────────────────────

describe('getUnreadCount', () => {
  it('retourne 0 par défaut (mock supabase count=null)', async () => {
    const count = await notifService.getUnreadCount(USER_ID);
    expect(typeof count).toBe('number');
  });

  it('throws AppError si supabase retourne une erreur', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: { message: 'DB error' } }))
      ),
    } as never);
    await expect(notifService.getUnreadCount(USER_ID)).rejects.toThrow(AppError);
  });
});

// ── markAsRead ────────────────────────────────────────────────────────────────

describe('markAsRead', () => {
  it('throws NotFoundError si notification introuvable', async () => {
    await expect(notifService.markAsRead(NOTIF_ID, USER_ID)).rejects.toThrow(NotFoundError);
  });

  it('throws AppError si la notification appartient à un autre utilisateur', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: NOTIF_ID, destinataire_id: OTHER_ID },
        error: null,
      }),
      update: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: null }))
      ),
    };
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(chain as never);
    await expect(notifService.markAsRead(NOTIF_ID, USER_ID)).rejects.toThrow(AppError);
  });

  it('marque la notification comme lue avec succès', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: NOTIF_ID, destinataire_id: USER_ID },
        error: null,
      }),
      update: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: null }))
      ),
    };
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(chain as never);
    await expect(notifService.markAsRead(NOTIF_ID, USER_ID)).resolves.toBeUndefined();
  });
});

// ── markAllAsRead ─────────────────────────────────────────────────────────────

describe('markAllAsRead', () => {
  it('se termine sans erreur', async () => {
    await expect(notifService.markAllAsRead(USER_ID)).resolves.toBeUndefined();
  });

  it('throws AppError si supabase retourne une erreur', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: { message: 'DB error' } }))
      ),
    } as never);
    await expect(notifService.markAllAsRead(USER_ID)).rejects.toThrow(AppError);
  });
});

// ── throwDbError (branche d\'erreur via getNotifications) ────────────────────

describe('throwDbError via getNotifications', () => {
  it('throws AppError si supabase retourne une erreur', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    const errorChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    };
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(errorChain as never);

    await expect(notifService.getNotifications({ userId: USER_ID, limit: 20 })).rejects.toThrow(AppError);
  });
});
