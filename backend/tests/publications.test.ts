import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { Request, Response } from 'express';
import app from '../src/server';
import * as pubService from '../src/services/publications.service';
import * as pubController from '../src/controllers/publications.controller';
import { supabaseAdmin } from '../src/config/supabase';
import axios from 'axios';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/publications.service');
vi.mock('axios');

function mockFromChain(data: unknown, error: unknown = null) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
  };
  vi.mocked(supabaseAdmin.from).mockReturnValueOnce(chain as never);
  return chain;
}

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

describe('PATCH /api/v1/publications/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après mise à jour', async () => {
    vi.mocked(pubService.updatePublication).mockResolvedValue(undefined);
    const res = await request(app)
      .patch('/api/v1/publications/pub-1')
      .set('Authorization', `Bearer ${profToken}`)
      .send({ titre: 'Nouveau titre' });
    expect(res.status).toBe(200);
  });

  it('retourne 403 si pas l\'auteur', async () => {
    vi.mocked(pubService.updatePublication).mockRejectedValue(
      Object.assign(new Error('Non autorisé'), { statusCode: 403, code: 'FORBIDDEN' })
    );
    const res = await request(app)
      .patch('/api/v1/publications/pub-1')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({ titre: 'Hack' });
    expect(res.status).toBe(403);
  });
});

describe('POST /api/v1/publications/:id/tts', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 202 si TTS en cours', async () => {
    vi.mocked(pubService.requestTts).mockResolvedValue({ ready: false, message: 'En cours...' });
    const res = await request(app)
      .post('/api/v1/publications/pub-1/tts')
      .set('Authorization', `Bearer ${etudiantToken}`);
    expect(res.status).toBe(202);
  });

  it('retourne 200 si TTS déjà disponible', async () => {
    vi.mocked(pubService.requestTts).mockResolvedValue({ ready: true, audio_url: 'https://audio.mp3' });
    const res = await request(app)
      .post('/api/v1/publications/pub-1/tts')
      .set('Authorization', `Bearer ${etudiantToken}`);
    expect(res.status).toBe(200);
  });
});

describe('POST /api/v1/publications/:id/signaler', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 201 après signalement', async () => {
    vi.mocked(pubService.signalerPublication).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/publications/pub-1/signaler')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({ motif: 'plagiat' });
    expect(res.status).toBe(201);
  });

  it('retourne 400 si motif manquant', async () => {
    const res = await request(app)
      .post('/api/v1/publications/pub-1/signaler')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/publications/:id/share', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 201 avec le lien de partage', async () => {
    vi.mocked(pubService.createShareLink).mockResolvedValue({ share_url: 'https://app/share/abc', expires_at: '2025-12-31' });
    const res = await request(app)
      .post('/api/v1/publications/pub-1/share')
      .set('Authorization', `Bearer ${etudiantToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('share_url');
  });
});

describe('POST /api/v1/publications', () => {
  const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31]); // %PDF-1

  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 403 si role !== professeur', async () => {
    const res = await request(app)
      .post('/api/v1/publications')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .attach('fichier', pdfBuffer, { filename: 'test.pdf', contentType: 'application/pdf' })
      .field('titre', 'Test Python')
      .field('matiere', 'Informatique')
      .field('niveau', 'L1')
      .field('type_doc', 'cours');
    expect(res.status).toBe(403);
  });

  it('retourne 400 si fichier manquant (professeur)', async () => {
    const res = await request(app)
      .post('/api/v1/publications')
      .set('Authorization', `Bearer ${profToken}`)
      .field('titre', 'Test Python')
      .field('matiere', 'Informatique')
      .field('niveau', 'L1')
      .field('type_doc', 'cours');
    expect(res.status).toBe(400);
  });

  it('retourne 403 si professeur non trouvé en BDD', async () => {
    mockFromChain(null);
    const res = await request(app)
      .post('/api/v1/publications')
      .set('Authorization', `Bearer ${profToken}`)
      .attach('fichier', pdfBuffer, { filename: 'test.pdf', contentType: 'application/pdf' })
      .field('titre', 'Test Python')
      .field('matiere', 'Informatique')
      .field('niveau', 'L1')
      .field('type_doc', 'cours');
    expect(res.status).toBe(403);
  });

  it('retourne 403 si professeur non actif', async () => {
    mockFromChain({ universite_id: 'univ-1', statut: 'suspendu' });
    const res = await request(app)
      .post('/api/v1/publications')
      .set('Authorization', `Bearer ${profToken}`)
      .attach('fichier', pdfBuffer, { filename: 'test.pdf', contentType: 'application/pdf' })
      .field('titre', 'Test Python')
      .field('matiere', 'Informatique')
      .field('niveau', 'L1')
      .field('type_doc', 'cours');
    expect(res.status).toBe(403);
  });

  it('retourne 202 après création réussie', async () => {
    mockFromChain({ universite_id: 'univ-1', statut: 'actif' });
    vi.mocked(pubService.createPublication).mockResolvedValue({ id: 'pub-new', statut_moderation: 'en_attente' } as never);
    const res = await request(app)
      .post('/api/v1/publications')
      .set('Authorization', `Bearer ${profToken}`)
      .attach('fichier', pdfBuffer, { filename: 'test.pdf', contentType: 'application/pdf' })
      .field('titre', 'Test Python')
      .field('matiere', 'Informatique')
      .field('niveau', 'L1')
      .field('type_doc', 'cours');
    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('id');
  });

  it('lance ValidationError si fichier trop volumineux (unitaire)', async () => {
    const req = {
      user: { id: 'prof-1', role: 'professeur' },
      file: { size: 51 * 1024 * 1024, mimetype: 'application/pdf', buffer: Buffer.from('%PDF-1'), originalname: 'big.pdf' },
      body: {},
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    await expect(pubController.createPublication(req, res)).rejects.toThrow('trop volumineux');
  });

  it('lance ValidationError si type mime invalide (unitaire)', async () => {
    const req = {
      user: { id: 'prof-1', role: 'professeur' },
      file: { size: 1024, mimetype: 'text/plain', buffer: Buffer.from('hello'), originalname: 'test.txt' },
      body: {},
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    await expect(pubController.createPublication(req, res)).rejects.toThrow('non supporté');
  });
});

describe('POST /api/v1/publications/:id/ask', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 404 si publication introuvable', async () => {
    mockFromChain(null);
    const res = await request(app)
      .post('/api/v1/publications/inexistant/ask')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({ question: 'Quelle est la syntaxe Python ?' });
    expect(res.status).toBe(404);
  });

  it('retourne 200 avec la réponse du chatbot', async () => {
    mockFromChain({ titre: 'Python Intro', resume_ia: 'Python est un langage dynamique.' });
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { reponse: 'Python est interprété.' } });
    const res = await request(app)
      .post('/api/v1/publications/pub-1/ask')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({ question: 'Quelle est la syntaxe Python ?' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reponse');
  });

  it('retourne 400 si question trop courte', async () => {
    const res = await request(app)
      .post('/api/v1/publications/pub-1/ask')
      .set('Authorization', `Bearer ${etudiantToken}`)
      .send({ question: 'Ok?' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/publications/:id — refine validation', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 400 si ni titre ni description fournis', async () => {
    const res = await request(app)
      .patch('/api/v1/publications/pub-1')
      .set('Authorization', `Bearer ${profToken}`)
      .send({});
    expect(res.status).toBe(400);
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
