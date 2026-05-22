import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as minService from '../src/services/ministere.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/ministere.service');

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;
const MIN_ID  = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const UNIV_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
const SIG_ID  = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

const minToken  = jwt.sign({ sub: MIN_ID,  role: 'ministere', email: 'min@gouv.bf' }, ACCESS_SECRET, { expiresIn: '15m' });
const etuToken  = jwt.sign({ sub: 'etu-1', role: 'etudiant',  email: 'etu@test.bf' }, ACCESS_SECRET, { expiresIn: '15m' });

const mockPage = { data: [], cursor_next: null, has_more: false };

describe('GET /api/v1/ministere/dashboard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les données du dashboard', async () => {
    vi.mocked(minService.getDashboard).mockResolvedValue({ statistiques: {}, universites_recentes: [], publications_recentes: [] });
    const res = await request(app).get('/api/v1/ministere/dashboard').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('statistiques');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/v1/ministere/dashboard');
    expect(res.status).toBe(401);
  });

  it('retourne 403 si rôle étudiant', async () => {
    const res = await request(app).get('/api/v1/ministere/dashboard').set('Authorization', `Bearer ${etuToken}`);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/v1/ministere/universites', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste paginée', async () => {
    vi.mocked(minService.listUniversites).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/ministere/universites').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('accepte le filtre ?statut=en_attente', async () => {
    vi.mocked(minService.listUniversites).mockResolvedValue(mockPage as never);
    const res = await request(app)
      .get('/api/v1/ministere/universites?statut=en_attente')
      .set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/ministere/universites/:id/dossier', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec le dossier', async () => {
    vi.mocked(minService.getUniversiteDossier).mockResolvedValue({ id: UNIV_ID, nom_officiel: 'UJKZ' });
    const res = await request(app).get(`/api/v1/ministere/universites/${UNIV_ID}/dossier`).set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('retourne 404 si université introuvable', async () => {
    vi.mocked(minService.getUniversiteDossier).mockRejectedValue(
      Object.assign(new Error('Université introuvable'), { statusCode: 404, code: 'NOT_FOUND' })
    );
    const res = await request(app).get(`/api/v1/ministere/universites/${UNIV_ID}/dossier`).set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/v1/ministere/universites/:id/approuver', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après approbation', async () => {
    vi.mocked(minService.approuverUniversite).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/ministere/universites/${UNIV_ID}/approuver`)
      .set('Authorization', `Bearer ${minToken}`)
      .send({});
    expect(res.status).toBe(200);
  });

  it('retourne 400 si transition de statut impossible', async () => {
    vi.mocked(minService.approuverUniversite).mockRejectedValue(
      Object.assign(new Error('Transition impossible'), { statusCode: 400, code: 'VALIDATION_ERROR' })
    );
    const res = await request(app)
      .patch(`/api/v1/ministere/universites/${UNIV_ID}/approuver`)
      .set('Authorization', `Bearer ${minToken}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/ministere/universites/:id/rejeter', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec motif valide', async () => {
    vi.mocked(minService.rejeterUniversite).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/ministere/universites/${UNIV_ID}/rejeter`)
      .set('Authorization', `Bearer ${minToken}`)
      .send({ motif: 'Dossier insuffisant' });
    expect(res.status).toBe(200);
  });

  it('retourne 400 si motif manquant', async () => {
    const res = await request(app)
      .patch(`/api/v1/ministere/universites/${UNIV_ID}/rejeter`)
      .set('Authorization', `Bearer ${minToken}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/ministere/universites/:id/suspendre', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec motif valide', async () => {
    vi.mocked(minService.suspendreUniversite).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/ministere/universites/${UNIV_ID}/suspendre`)
      .set('Authorization', `Bearer ${minToken}`)
      .send({ motif: 'Non-conformité réglementaire' });
    expect(res.status).toBe(200);
  });
});

describe('PATCH /api/v1/ministere/universites/:id/reactiver', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après réactivation', async () => {
    vi.mocked(minService.reactiverUniversite).mockResolvedValue(undefined);
    const res = await request(app)
      .patch(`/api/v1/ministere/universites/${UNIV_ID}/reactiver`)
      .set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/ministere/statistiques', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les statistiques', async () => {
    vi.mocked(minService.getStatistiques).mockResolvedValue({ global: {}, evolution_mensuelle: [] });
    const res = await request(app).get('/api/v1/ministere/statistiques').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('global');
  });
});

describe('GET /api/v1/ministere/carte', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des universités géolocalisées', async () => {
    vi.mocked(minService.getCarte).mockResolvedValue([{ id: UNIV_ID, latitude: 12.3, longitude: -1.5 }]);
    const res = await request(app).get('/api/v1/ministere/carte').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('GET /api/v1/ministere/statistiques-nationales', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les statistiques nationales', async () => {
    vi.mocked(minService.getStatistiquesNationales).mockResolvedValue({ global: {}, evolution_mensuelle: [] });
    const res = await request(app).get('/api/v1/ministere/statistiques-nationales').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/v1/ministere/statistiques-nationales/region', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec les stats par région', async () => {
    vi.mocked(minService.getStatistiquesParRegion).mockResolvedValue([{ region: 'Centre', nb_universites: 3 }]);
    const res = await request(app).get('/api/v1/ministere/statistiques-nationales/region').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('GET /api/v1/ministere/signalements', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des signalements', async () => {
    vi.mocked(minService.listSignalements).mockResolvedValue(mockPage as never);
    const res = await request(app).get('/api/v1/ministere/signalements').set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('DELETE /api/v1/ministere/signalements/:id/supprimer', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après suppression', async () => {
    vi.mocked(minService.traiterSignalement).mockResolvedValue(undefined);
    const res = await request(app)
      .delete(`/api/v1/ministere/signalements/${SIG_ID}/supprimer`)
      .set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(204);
  });
});

describe('POST /api/v1/ministere/signalements/:id/innocenter', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après innocentement', async () => {
    vi.mocked(minService.traiterSignalement).mockResolvedValue(undefined);
    const res = await request(app)
      .post(`/api/v1/ministere/signalements/${SIG_ID}/innocenter`)
      .set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
  });
});

describe('POST /api/v1/ministere/signalements/:id/avertir', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 après avertissement', async () => {
    vi.mocked(minService.traiterSignalement).mockResolvedValue(undefined);
    const res = await request(app)
      .post(`/api/v1/ministere/signalements/${SIG_ID}/avertir`)
      .set('Authorization', `Bearer ${minToken}`);
    expect(res.status).toBe(200);
  });
});
