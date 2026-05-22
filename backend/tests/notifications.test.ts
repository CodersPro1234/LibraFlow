import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as notifService from '../src/services/notifications.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/notifications.service', () => ({
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
}));

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;
const USER_ID  = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const NOTIF_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

const userToken = jwt.sign({ sub: USER_ID, role: 'etudiant', email: 'etu@test.bf' }, ACCESS_SECRET, { expiresIn: '15m' });

describe('GET /api/v1/notifications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des notifications', async () => {
    vi.mocked(notifService.getNotifications).mockResolvedValue({
      data: [],
      unread_count: 0,
      cursor_next: null,
      has_more: false,
    });
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('unread_count');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.status).toBe(401);
  });

  it('accepte le filtre ?lu=false', async () => {
    vi.mocked(notifService.getNotifications).mockResolvedValue({
      data: [],
      unread_count: 2,
      cursor_next: null,
      has_more: false,
    });
    const res = await request(app)
      .get('/api/v1/notifications?lu=false')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

  it('accepte le filtre ?lu=true', async () => {
    vi.mocked(notifService.getNotifications).mockResolvedValue({
      data: [],
      unread_count: 0,
      cursor_next: null,
      has_more: false,
    });
    const res = await request(app)
      .get('/api/v1/notifications?lu=true')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/notifications/unread/count', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec le nombre de non-lues', async () => {
    vi.mocked(notifService.getUnreadCount).mockResolvedValue(5);
    const res = await request(app)
      .get('/api/v1/notifications/unread/count')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body.count).toBe(5);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/notifications/unread/count');
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/v1/notifications/:id/read', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après marquage comme lue', async () => {
    vi.mocked(notifService.markAsRead).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/notifications/${NOTIF_ID}/read`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(204);
  });

  it('retourne 404 si notification introuvable', async () => {
    vi.mocked(notifService.markAsRead).mockRejectedValue(
      Object.assign(new Error('Notification introuvable'), { statusCode: 404, code: 'NOT_FOUND' })
    );
    const res = await request(app)
      .patch(`/api/v1/notifications/${NOTIF_ID}/read`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });

  it('retourne 403 si notification appartient à un autre utilisateur', async () => {
    vi.mocked(notifService.markAsRead).mockRejectedValue(
      Object.assign(new Error('Non autorisé'), { statusCode: 403, code: 'FORBIDDEN' })
    );
    const res = await request(app)
      .patch(`/api/v1/notifications/${NOTIF_ID}/read`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/v1/notifications/read-all', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après marquage de toutes comme lues', async () => {
    vi.mocked(notifService.markAllAsRead).mockResolvedValue(undefined);
    const res = await request(app)
      .patch('/api/v1/notifications/read-all')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(204);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).patch('/api/v1/notifications/read-all');
    expect(res.status).toBe(401);
  });
});
