import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as authService from '../src/services/auth.service';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/auth.service');

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;
const userToken = jwt.sign({ sub: 'user-1', role: 'etudiant', email: 'user@test.bf' }, ACCESS_SECRET, { expiresIn: '15m' });

const mockTokens = {
  access_token: 'mock.access.token',
  refresh_token: 'mock.refresh.token',
  expires_in: 900,
};

const VALID_UUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec des tokens valides', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      ...mockTokens,
      user: { id: 'user-1', role: 'etudiant', nom: 'Test User' },
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifiant: 'test@test.bf', password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
  });

  it('retourne 400 si identifiant manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'Password123!' });

    expect(res.status).toBe(400);
  });

  it('retourne 400 si password manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifiant: 'test@test.bf' });

    expect(res.status).toBe(400);
  });

  it('retourne 401 si identifiants incorrects', async () => {
    vi.mocked(authService.login).mockRejectedValue(
      Object.assign(new Error('Identifiants invalides'), { statusCode: 401, code: 'AUTH_ERROR' })
    );

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifiant: 'wrong@test.bf', password: 'WrongPass!' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/register/etudiant', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 201 avec les données valides', async () => {
    vi.mocked(authService.registerEtudiant).mockResolvedValue({
      ...mockTokens,
      user: { id: 'etu-1', role: 'etudiant', nom: 'Test Etudiant' },
    });

    const res = await request(app)
      .post('/api/v1/auth/register/etudiant')
      .send({
        password: 'Password123!',
        numero_ine: 'BF2300001',
        universite_id: VALID_UUID,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
  });

  it('retourne 400 si INE manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/etudiant')
      .send({
        password: 'Password123!',
        universite_id: VALID_UUID,
      });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec un refresh token valide', async () => {
    vi.mocked(authService.refreshAccessToken).mockResolvedValue({
      access_token: 'new.access.token',
      expires_in: 900,
    });

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refresh_token: 'valid.refresh.token' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
  });

  it('retourne 400 si refresh_token manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/auth/verify-ine/:ine', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 si INE valide', async () => {
    vi.mocked(authService.verifyIne).mockResolvedValue({ valid: true, nom_complet: 'Moussa Test' });
    const res = await request(app).get('/api/v1/auth/verify-ine/BF2300001');
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body).toHaveProperty('nom_complet');
  });

  it('retourne 404 si INE invalide', async () => {
    vi.mocked(authService.verifyIne).mockResolvedValue({ valid: false });
    const res = await request(app).get('/api/v1/auth/verify-ine/INVALID');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/v1/auth/register/professeur', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 201 avec les données valides', async () => {
    vi.mocked(authService.registerProfesseur).mockResolvedValue({ message: 'En attente', id: 'prof-1' });
    const res = await request(app)
      .post('/api/v1/auth/register/professeur')
      .field('email_pro', 'prof@test.bf')
      .field('password', 'Password123!')
      .field('nom_complet', 'Dr Test')
      .field('universite_id', VALID_UUID)
      .field('matieres', '["Maths"]');
    expect(res.status).toBe(201);
  });
});

describe('POST /api/v1/auth/register/universite', () => {
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG magic bytes

  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 400 si logo manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/universite')
      .field('nom_officiel', 'Test Univ')
      .field('email', 'univ@test.bf')
      .field('password', 'TestPass123!')
      .field('nom_administrateur', 'Admin Test')
      .field('adresse', 'Rue Test Ouagadougou');
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('retourne 201 avec logo valide', async () => {
    vi.mocked(authService.registerUniversite).mockResolvedValue({ message: 'En attente', id: 'univ-1' });
    const res = await request(app)
      .post('/api/v1/auth/register/universite')
      .attach('logo', pngBuffer, { filename: 'logo.png', contentType: 'image/png' })
      .field('nom_officiel', 'Université Test BF')
      .field('email', 'univ@test.bf')
      .field('password', 'TestPass123!')
      .field('nom_administrateur', 'Admin Test')
      .field('adresse', 'Rue Test Ouagadougou')
      .field('latitude', '12.37')
      .field('longitude', '-1.53');
    expect(res.status).toBe(201);
  });

  it('retourne 201 avec logo valide (latitude invalide ignorée)', async () => {
    vi.mocked(authService.registerUniversite).mockResolvedValue({ message: 'En attente', id: 'univ-2' });
    const res = await request(app)
      .post('/api/v1/auth/register/universite')
      .attach('logo', pngBuffer, { filename: 'logo.png', contentType: 'image/png' })
      .field('nom_officiel', 'Université Test BF2')
      .field('email', 'univ2@test.bf')
      .field('password', 'TestPass123!')
      .field('nom_administrateur', 'Admin Test')
      .field('adresse', 'Rue Test Ouagadougou')
      .field('latitude', 'not-a-number');
    expect(res.status).toBe(201);
  });
});

describe('POST /api/v1/auth/logout', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 204 après logout réussi', async () => {
    vi.mocked(authService.logout).mockResolvedValue(undefined);
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ refresh_token: 'some.refresh.token' });
    expect(res.status).toBe(204);
  });
});

describe('GET /health', () => {
  it('retourne 200 avec le statut ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
  });
});
