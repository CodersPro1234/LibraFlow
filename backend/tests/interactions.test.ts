import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as interactionsService from '../src/services/interactions.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/interactions.service', () => ({
  likePublication: vi.fn(),
  unlikePublication: vi.fn(),
  getCommentaires: vi.fn(),
  postCommentaire: vi.fn(),
  deleteCommentaire: vi.fn(),
  savePublication: vi.fn(),
  unsavePublication: vi.fn(),
  followProfesseur: vi.fn(),
  unfollowProfesseur: vi.fn(),
  followUniversite: vi.fn(),
  unfollowUniversite: vi.fn(),
  getCommunaute: vi.fn(),
}));

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

describe('GET /api/v1/publications/:id/comments', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des commentaires', async () => {
    vi.mocked(interactionsService.getCommentaires).mockResolvedValue({
      data: [],
      cursor_next: null,
      has_more: false,
    });

    const res = await request(app)
      .get('/api/v1/publications/pub-1/comments')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/publications/pub-1/comments');
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/comments/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après suppression réussie', async () => {
    vi.mocked(interactionsService.deleteCommentaire).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/v1/comments/com-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 403 si non autorisé', async () => {
    vi.mocked(interactionsService.deleteCommentaire).mockRejectedValue(
      Object.assign(new Error('Non autorisé'), { statusCode: 403, code: 'FORBIDDEN' })
    );

    const res = await request(app)
      .delete('/api/v1/comments/com-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(403);
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

describe('DELETE /api/v1/publications/:id/save', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après unsave réussi', async () => {
    vi.mocked(interactionsService.unsavePublication).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/v1/publications/pub-1/save')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });
});

describe('DELETE /api/v1/follow/professeur/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après unfollow réussi', async () => {
    vi.mocked(interactionsService.unfollowProfesseur).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/v1/follow/professeur/prof-2')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });
});

describe('POST /api/v1/follow/universite/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après follow université réussi', async () => {
    vi.mocked(interactionsService.followUniversite).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/v1/follow/universite/univ-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 409 si déjà suivi', async () => {
    vi.mocked(interactionsService.followUniversite).mockRejectedValue(
      Object.assign(new Error('Déjà suivi'), { statusCode: 409, code: 'CONFLICT' })
    );

    const res = await request(app)
      .post('/api/v1/follow/universite/univ-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/v1/follow/universite/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après unfollow université réussi', async () => {
    vi.mocked(interactionsService.unfollowUniversite).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/v1/follow/universite/univ-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(204);
  });
});
