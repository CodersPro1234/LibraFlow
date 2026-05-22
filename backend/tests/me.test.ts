import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as meService from '../src/services/me.service';
import * as pubService from '../src/services/publications.service';
import * as interactionsService from '../src/services/interactions.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/me.service', () => ({
  getProfile: vi.fn(),
  changePassword: vi.fn(),
  getHistorique: vi.fn(),
  addHistorique: vi.fn(),
  getDownloads: vi.fn(),
  getAbonnes: vi.fn(),
  getMesPublicationsStats: vi.fn(),
  getInteractionsRecentes: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock('../src/services/publications.service', () => ({
  getBibliotheque: vi.fn(),
  getRecommendations: vi.fn(),
  getMesPublications: vi.fn(),
}));
vi.mock('../src/services/interactions.service', () => ({
  getCommunaute: vi.fn(),
}));

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;
const ETU_ID  = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const PROF_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

const etuToken  = jwt.sign({ sub: ETU_ID,  role: 'etudiant',   email: 'etu@test.bf'  }, ACCESS_SECRET, { expiresIn: '15m' });
const profToken = jwt.sign({ sub: PROF_ID, role: 'professeur', email: 'prof@test.bf' }, ACCESS_SECRET, { expiresIn: '15m' });

const mockPage = { data: [], cursor_next: null, has_more: false };

describe('GET /api/v1/me', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec le profil étudiant', async () => {
    vi.mocked(meService.getProfile).mockResolvedValue({ id: ETU_ID, role: 'etudiant', nom_complet: 'Test Etu' });
    const res = await request(app).get('/api/v1/me').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('retourne 200 avec le profil professeur', async () => {
    vi.mocked(meService.getProfile).mockResolvedValue({ id: PROF_ID, role: 'professeur', nom_complet: 'Dr. Test' });
    const res = await request(app).get('/api/v1/me').set('Authorization', `Bearer ${profToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/me');
    expect(res.status).toBe(401);
  });

  it('retourne 404 si profil introuvable', async () => {
    vi.mocked(meService.getProfile).mockRejectedValue(
      Object.assign(new Error('Profil introuvable'), { statusCode: 404, code: 'NOT_FOUND' })
    );
    const res = await request(app).get('/api/v1/me').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(404);
  });
});

describe('POST /api/v1/me/password', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après changement de mot de passe', async () => {
    vi.mocked(meService.changePassword).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/me/password')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ current_password: 'OldPass123!', new_password: 'NewPass456!' });
    expect(res.status).toBe(204);
  });

  it('retourne 400 si nouveau mot de passe manquant', async () => {
    const res = await request(app)
      .post('/api/v1/me/password')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ current_password: 'OldPass123!' });
    expect(res.status).toBe(400);
  });

  it('retourne 400 si mot de passe actuel manquant', async () => {
    const res = await request(app)
      .post('/api/v1/me/password')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ new_password: 'NewPass456!' });
    expect(res.status).toBe(400);
  });

  it('retourne 401 si mot de passe actuel incorrect', async () => {
    vi.mocked(meService.changePassword).mockRejectedValue(
      Object.assign(new Error('Mot de passe actuel incorrect'), { statusCode: 401, code: 'AUTH_ERROR' })
    );
    const res = await request(app)
      .post('/api/v1/me/password')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ current_password: 'WrongPass!', new_password: 'NewPass456!' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/me/library', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la bibliothèque de l\'étudiant', async () => {
    vi.mocked(pubService.getBibliotheque).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/me/library').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/me/library');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/me/history', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec l\'historique de lecture', async () => {
    vi.mocked(meService.getHistorique).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/me/history').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
  });
});

describe('POST /api/v1/me/history', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après ajout à l\'historique', async () => {
    vi.mocked(meService.addHistorique).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/me/history')
      .set('Authorization', `Bearer ${etuToken}`)
      .send({ publication_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' });
    expect(res.status).toBe(204);
  });
});

describe('GET /api/v1/me/recommendations', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les recommandations', async () => {
    vi.mocked(pubService.getRecommendations).mockResolvedValue([]);
    const res = await request(app).get('/api/v1/me/recommendations').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('GET /api/v1/me/publications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les publications du professeur', async () => {
    vi.mocked(pubService.getMesPublications).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/me/publications').set('Authorization', `Bearer ${profToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/me/community', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la communauté du professeur', async () => {
    vi.mocked(interactionsService.getCommunaute).mockResolvedValue({ abonnes: 0, publications: 0 } as never);
    const res = await request(app).get('/api/v1/me/community').set('Authorization', `Bearer ${profToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/me/downloads', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des téléchargements', async () => {
    vi.mocked(meService.getDownloads).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/me/downloads').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/me/abonnes', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des abonnés', async () => {
    vi.mocked(meService.getAbonnes).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/me/abonnes').set('Authorization', `Bearer ${profToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/me/publications/stats', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les stats du professeur', async () => {
    vi.mocked(meService.getMesPublicationsStats).mockResolvedValue({
      total: 5,
      likes_total: 20,
      vues_total: 500,
      telechargements_total: 100,
    } as never);
    const res = await request(app)
      .get('/api/v1/me/publications/stats')
      .set('Authorization', `Bearer ${profToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
  });
});

describe('GET /api/v1/me/interactions-recentes', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les interactions récentes', async () => {
    vi.mocked(meService.getInteractionsRecentes).mockResolvedValue({
      likes: [],
      commentaires: [],
    } as never);
    const res = await request(app)
      .get('/api/v1/me/interactions-recentes')
      .set('Authorization', `Bearer ${profToken}`);
    expect(res.status).toBe(200);
  });
});

describe('PATCH /api/v1/me', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après mise à jour du profil (sans fichier)', async () => {
    vi.mocked(meService.updateProfile).mockResolvedValue(undefined);
    const res = await request(app)
      .patch('/api/v1/me')
      .set('Authorization', `Bearer ${etuToken}`)
      .field('nom_complet', 'Nouveau Nom');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('retourne 200 avec matieres JSON valide', async () => {
    vi.mocked(meService.updateProfile).mockResolvedValue(undefined);
    const res = await request(app)
      .patch('/api/v1/me')
      .set('Authorization', `Bearer ${profToken}`)
      .field('nom_complet', 'Dr Test')
      .field('matieres', '["Maths","Physique"]');
    expect(res.status).toBe(200);
  });

  it('retourne 200 même si matieres JSON invalide (ignoré silencieusement)', async () => {
    vi.mocked(meService.updateProfile).mockResolvedValue(undefined);
    const res = await request(app)
      .patch('/api/v1/me')
      .set('Authorization', `Bearer ${profToken}`)
      .field('nom_complet', 'Dr Test')
      .field('matieres', 'not-valid-json');
    expect(res.status).toBe(200);
  });
});
