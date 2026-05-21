import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as pubService from '../src/services/publications.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/publications.service');

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;

function makeToken(payload: object): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

const profToken = makeToken({ sub: 'prof-1', role: 'professeur', email: 'prof@test.bf' });
const etudiantToken = makeToken({ sub: 'etu-1', role: 'etudiant', email: 'etu@test.bf' });

const mockPublication = {
  id: 'pub-1',
  titre: 'Introduction à Python',
  matiere: 'Informatique',
  niveau: 'L1',
  type_doc: 'cours',
  statut_moderation: 'validee',
  pdf_url: 'https://storage.test/doc.pdf',
  likes_count: 5,
  vues_count: 100,
  telechargements_count: 20,
  commentaires_count: 3,
  professeur_id: 'prof-1',
  universite_id: 'univ-1',
  created_at: new Date().toISOString(),
  is_liked: false,
  is_saved: false,
  professeur: { id: 'prof-1', nom_complet: 'Prof Test', photo_url: null },
  universite: { id: 'univ-1', nom_officiel: 'Université Test' },
};

describe('GET /api/v1/publications/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec une publication valide', async () => {
    vi.mocked(pubService.getPublication).mockResolvedValue(mockPublication as never);

    const res = await request(app)
      .get('/api/v1/publications/pub-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('pub-1');
    expect(res.body.titre).toBe('Introduction à Python');
  });

  it('retourne 404 si publication introuvable', async () => {
    vi.mocked(pubService.getPublication).mockRejectedValue(
      Object.assign(new Error('Publication non trouvée'), { statusCode: 404, code: 'NOT_FOUND' })
    );

    const res = await request(app)
      .get('/api/v1/publications/inexistant')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(404);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/publications/pub-1');
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/publications/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 si le professeur est l\'auteur', async () => {
    vi.mocked(pubService.deletePublication).mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/v1/publications/pub-1')
      .set('Authorization', `Bearer ${profToken}`);

    expect(res.status).toBe(204);
  });

  it('retourne 403 si non autorisé', async () => {
    vi.mocked(pubService.deletePublication).mockRejectedValue(
      Object.assign(new Error('Non autorisé'), { statusCode: 403, code: 'FORBIDDEN' })
    );

    const res = await request(app)
      .delete('/api/v1/publications/pub-1')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/v1/publications/:id/download', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec un download_url', async () => {
    vi.mocked(pubService.getDownloadUrl).mockResolvedValue({
      download_url: 'https://storage.test/signed-url',
      expires_in: 3600,
    });

    const res = await request(app)
      .get('/api/v1/publications/pub-1/download')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('download_url');
    expect(res.body.expires_in).toBe(3600);
  });
});

describe('GET /api/v1/feed', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec data et cursor_next', async () => {
    vi.mocked(pubService.getFeed).mockResolvedValue({
      data: [mockPublication as never],
      cursor_next: null,
      has_more: false,
    });

    const res = await request(app)
      .get('/api/v1/feed')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('has_more');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/feed');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/publications/search', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec résultats', async () => {
    vi.mocked(pubService.searchPublications).mockResolvedValue({
      data: [mockPublication],
      total: 1,
      page: 1,
      limit: 20,
    });

    const res = await request(app)
      .get('/api/v1/publications/search?q=python')
      .set('Authorization', `Bearer ${etudiantToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.total).toBe(1);
  });
});

describe('Services unitaires — Publications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getRecommendations retourne un tableau', async () => {
    vi.mocked(pubService.getRecommendations).mockResolvedValue([mockPublication as never]);
    const result = await pubService.getRecommendations('etu-1');
    expect(Array.isArray(result)).toBe(true);
  });

  it('getOfflineFeedPack retourne un tableau', async () => {
    vi.mocked(pubService.getOfflineFeedPack).mockResolvedValue([mockPublication as never]);
    const result = await pubService.getOfflineFeedPack();
    expect(Array.isArray(result)).toBe(true);
  });
});

// Mock inutilisé mais nécessaire pour éviter les imports circulaires
vi.mock('../src/services/auth.service', () => ({
  login: vi.fn(),
  registerEtudiant: vi.fn(),
  registerProfesseur: vi.fn(),
  registerUniversite: vi.fn(),
  refreshToken: vi.fn(),
  logout: vi.fn(),
  verifyIne: vi.fn(),
}));
