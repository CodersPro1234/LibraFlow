import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as interactionsService from '../src/services/interactions.service';
import * as pubService from '../src/services/publications.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/interactions.service');
vi.mock('../src/services/publications.service');

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;
const ETU_ID = 'etu-111';
const etuToken = jwt.sign({ sub: ETU_ID, role: 'etudiant', email: 'etu@test.bf' }, ACCESS_SECRET, { expiresIn: '15m' });

describe('POST /api/v1/sync/pending-actions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 401 sans token', async () => {
    const res = await request(app).post('/api/v1/sync/pending-actions').send({ actions: [] });
    expect(res.status).toBe(401);
  });

  it('traite une liste vide d\'actions', async () => {
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toEqual([]);
    expect(res.body.failed).toEqual([]);
  });

  it('traite une action like', async () => {
    vi.mocked(interactionsService.likePublication).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'like', payload: { publication_id: 'pub-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('like');
  });

  it('traite une action unlike', async () => {
    vi.mocked(interactionsService.unlikePublication).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'unlike', payload: { publication_id: 'pub-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('unlike');
  });

  it('traite une action comment', async () => {
    vi.mocked(interactionsService.postCommentaire).mockResolvedValue({ id: 'com-1' } as never);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'comment', payload: { publication_id: 'pub-1', contenu: 'Super !' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('comment');
  });

  it('traite une action save', async () => {
    vi.mocked(interactionsService.savePublication).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'save', payload: { publication_id: 'pub-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('save');
  });

  it('traite une action unsave', async () => {
    vi.mocked(interactionsService.unsavePublication).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'unsave', payload: { publication_id: 'pub-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('unsave');
  });

  it('traite une action follow professeur', async () => {
    vi.mocked(interactionsService.followProfesseur).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'follow', payload: { cible_type: 'professeur', cible_id: 'prof-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('follow');
  });

  it('traite une action follow université', async () => {
    vi.mocked(interactionsService.followUniversite).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'follow', payload: { cible_type: 'universite', cible_id: 'univ-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('follow');
  });

  it('traite une action unfollow professeur', async () => {
    vi.mocked(interactionsService.unfollowProfesseur).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'unfollow', payload: { cible_type: 'professeur', cible_id: 'prof-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('unfollow');
  });

  it('traite une action unfollow université', async () => {
    vi.mocked(interactionsService.unfollowUniversite).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'unfollow', payload: { cible_type: 'universite', cible_id: 'univ-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.processed).toContain('unfollow');
  });

  it('ignore silencieusement les actions en doublon (ConflictError)', async () => {
    vi.mocked(interactionsService.likePublication).mockRejectedValue(
      Object.assign(new Error('déjà liké'), { statusCode: 409, code: 'CONFLICT' })
    );
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'like', payload: { publication_id: 'pub-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.failed).toEqual([]);
  });

  it('met les erreurs réelles dans failed', async () => {
    vi.mocked(interactionsService.likePublication).mockRejectedValue(
      Object.assign(new Error('Erreur interne'), { statusCode: 500, code: 'SERVER_ERROR' })
    );
    const res = await request(app)
      .post('/api/v1/sync/pending-actions')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ actions: [{ type: 'like', payload: { publication_id: 'pub-1' }, client_timestamp: new Date().toISOString() }] });
    expect(res.status).toBe(200);
    expect(res.body.failed.length).toBeGreaterThan(0);
  });
});

describe('GET /api/v1/offline/offline-feed-pack', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec le pack offline', async () => {
    vi.mocked(pubService.getOfflineFeedPack).mockResolvedValue([]);
    const res = await request(app)
      .get('/api/v1/offline/offline-feed-pack')
      .set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('accepte le paramètre since', async () => {
    vi.mocked(pubService.getOfflineFeedPack).mockResolvedValue([]);
    const res = await request(app)
      .get('/api/v1/offline/offline-feed-pack?since=2024-01-01')
      .set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/offline/offline-feed-pack');
    expect(res.status).toBe(401);
  });
});
