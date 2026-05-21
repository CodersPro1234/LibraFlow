import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as interactionsService from '../src/services/interactions.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/interactions.service');

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;

function makeToken(payload: object): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

const etudiantToken = makeToken({ sub: 'etu-1', role: 'etudiant', email: 'etu@test.bf' });

describe('POST /api/v1/publications/:id/like', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après un like réussi', async () => {
    vi.mocked(interactionsService.likePublication).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/v1/publications/pub-1/like')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 409 si déjà liké', async () => {
    vi.mocked(interactionsService.likePublication).mockRejectedValue(
      Object.assign(new Error('Déjà liké'), { statusCode: 409, code: 'CONFLICT' })
    );

    const res = await request(app)
      .post('/api/v1/publications/pub-1/like')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(409);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).post('/api/v1/publications/pub-1/like');
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/publications/:id/like', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après unlike réussi', async () => {
    vi.mocked(interactionsService.unlikePublication).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/v1/publications/pub-1/like')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });
});

describe('POST /api/v1/publications/:id/comments', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  const mockComment = {
    id: 'com-1',
    contenu: 'Super cours !',
    user_id: 'etu-1',
    user_role: 'etudiant',
    publication_id: 'pub-1',
    created_at: new Date().toISOString(),
    parent_id: null,
    user: { nom_complet: 'Etudiant Test', photo_url: null },
  };

  it('retourne 201 avec le commentaire créé', async () => {
    vi.mocked(interactionsService.postCommentaire).mockResolvedValue(mockComment as never);

    const res = await request(app)
      .post('/api/v1/publications/pub-1/comments')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({ contenu: 'Super cours !' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe('com-1');
  });

  it('retourne 400 si contenu manquant', async () => {
    const res = await request(app)
      .post('/api/v1/publications/pub-1/comments')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/follow/professeur/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après follow réussi', async () => {
    vi.mocked(interactionsService.followProfesseur).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/v1/follow/professeur/prof-2')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 409 si déjà suivi', async () => {
    vi.mocked(interactionsService.followProfesseur).mockRejectedValue(
      Object.assign(new Error('Déjà suivi'), { statusCode: 409, code: 'CONFLICT' })
    );

    const res = await request(app)
      .post('/api/v1/follow/professeur/prof-2')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(409);
  });
});

describe('POST /api/v1/publications/:id/save', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après save réussi', async () => {
    vi.mocked(interactionsService.savePublication).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/v1/publications/pub-1/save')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });
});
