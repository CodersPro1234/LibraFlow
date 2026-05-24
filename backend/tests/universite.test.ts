import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as univService from '../src/services/universite.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/universite.service');

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;
const UNIV_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const PROF_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
const ETU_ID  = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
const PUB_ID  = 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';

const univToken = jwt.sign({ sub: UNIV_ID, role: 'universite', email: 'univ@test.bf' }, ACCESS_SECRET, { expiresIn: '15m' });
const etuToken  = jwt.sign({ sub: ETU_ID,  role: 'etudiant',   email: 'etu@test.bf'  }, ACCESS_SECRET, { expiresIn: '15m' });

const mockPage = { data: [], cursor_next: null, has_more: false };

describe('GET /api/v1/universite/dashboard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les données du dashboard', async () => {
    vi.mocked(univService.getDashboard).mockResolvedValue({ statistiques: {}, professeurs_en_attente: [], publications_recentes: [] });
    const res = await request(app).get('/api/v1/universite/dashboard').set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('statistiques');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/universite/dashboard');
    expect(res.status).toBe(401);
  });

  it('retourne 403 si rôle etudiant', async () => {
    const res = await request(app).get('/api/v1/universite/dashboard').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/v1/universite/professeurs', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste paginée', async () => {
    vi.mocked(univService.listProfesseurs).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/universite/professeurs').set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('PATCH /api/v1/universite/professeurs/:id/valider', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après validation', async () => {
    vi.mocked(univService.validerProfesseur).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/universite/professeurs/${PROF_ID}/valider`)
      .set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
  });

  it('retourne 404 si professeur introuvable', async () => {
    vi.mocked(univService.validerProfesseur).mockRejectedValue(
      Object.assign(new Error('Professeur introuvable'), { statusCode: 404, code: 'NOT_FOUND' })
    );
    const res = await request(app)
      .patch(`/api/v1/universite/professeurs/${PROF_ID}/valider`)
      .set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(404);
  });

  it('retourne 403 si professeur hors université', async () => {
    vi.mocked(univService.validerProfesseur).mockRejectedValue(
      Object.assign(new Error("Ce professeur n'appartient pas à votre université"), { statusCode: 403, code: 'FORBIDDEN' })
    );
    const res = await request(app)
      .patch(`/api/v1/universite/professeurs/${PROF_ID}/valider`)
      .set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/v1/universite/professeurs/:id/rejeter', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec motif valide', async () => {
    vi.mocked(univService.rejeterProfesseur).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/universite/professeurs/${PROF_ID}/rejeter`)
      .set('Authorization', `Bearer ${univToken}`)
      .send({ motif: 'Dossier incomplet' });
    expect(res.status).toBe(200);
  });

  it('retourne 400 si motif manquant', async () => {
    const res = await request(app)
      .patch(`/api/v1/universite/professeurs/${PROF_ID}/rejeter`)
      .set('Authorization', `Bearer ${univToken}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/universite/professeurs/:id/suspendre', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec motif valide', async () => {
    vi.mocked(univService.suspendreProfesseur).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/universite/professeurs/${PROF_ID}/suspendre`)
      .set('Authorization', `Bearer ${univToken}`)
      .send({ motif: 'Comportement inapproprié' });
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/universite/etudiants', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste paginée', async () => {
    vi.mocked(univService.listEtudiants).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/universite/etudiants').set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('PATCH /api/v1/universite/etudiants/:id/suspendre', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec motif valide', async () => {
    vi.mocked(univService.suspendreEtudiant).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/universite/etudiants/${ETU_ID}/suspendre`)
      .set('Authorization', `Bearer ${univToken}`)
      .send({ motif: 'Fraude académique' });
    expect(res.status).toBe(200);
  });

  it('retourne 404 si étudiant introuvable', async () => {
    vi.mocked(univService.suspendreEtudiant).mockRejectedValue(
      Object.assign(new Error('Étudiant introuvable'), { statusCode: 404, code: 'NOT_FOUND' })
    );
    const res = await request(app)
      .patch(`/api/v1/universite/etudiants/${ETU_ID}/suspendre`)
      .set('Authorization', `Bearer ${univToken}`)
      .send({ motif: 'Fraude' });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/v1/universite/etudiants/:id/reactiver', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après réactivation', async () => {
    vi.mocked(univService.reactiverEtudiant).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/universite/etudiants/${ETU_ID}/reactiver`)
      .set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/universite/publications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste paginée', async () => {
    vi.mocked(univService.listPublications).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/universite/publications').set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/v1/universite/publications/:id/supprimer', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après suppression', async () => {
    vi.mocked(univService.supprimerPublication).mockResolvedValue(undefined);
    const res = await request(app)
      .delete(`/api/v1/universite/publications/${PUB_ID}/supprimer`)
      .set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(204);
  });

  it('retourne 403 si publication hors université', async () => {
    vi.mocked(univService.supprimerPublication).mockRejectedValue(
      Object.assign(new Error("Cette publication n'appartient pas à votre université"), { statusCode: 403, code: 'FORBIDDEN' })
    );
    const res = await request(app)
      .delete(`/api/v1/universite/publications/${PUB_ID}/supprimer`)
      .set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/v1/universite/top', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec le top publications', async () => {
    vi.mocked(univService.getTopPublications).mockResolvedValue([]);
    const res = await request(app).get('/api/v1/universite/top').set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/universite/evolution-mensuelle', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les données d\'évolution', async () => {
    vi.mocked(univService.getEvolutionMensuelle).mockResolvedValue([]);
    const res = await request(app).get('/api/v1/universite/evolution-mensuelle').set('Authorization', `Bearer ${univToken}`);
    expect(res.status).toBe(200);
  });
});
