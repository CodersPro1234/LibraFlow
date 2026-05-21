import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as authService from '../src/services/auth.service';

vi.mock('../src/services/auth.service');

const mockTokens = {
  access_token: 'mock.access.token',
  refresh_token: 'mock.refresh.token',
  expires_in: 900,
};

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne 200 avec des tokens valides', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      ...mockTokens,
      user: { id: 'user-1', role: 'etudiant', email: 'test@test.bf' },
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.bf', password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
  });

  it('retourne 400 si email manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'Password123!' });

    expect(res.status).toBe(400);
  });

  it('retourne 400 si password manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.bf' });

    expect(res.status).toBe(400);
  });

  it('retourne 401 si identifiants incorrects', async () => {
    vi.mocked(authService.login).mockRejectedValue(
      Object.assign(new Error('Identifiants invalides'), { statusCode: 401, code: 'AUTH_ERROR' })
    );

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@test.bf', password: 'WrongPass!' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/register/etudiant', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne 201 avec les données valides', async () => {
    vi.mocked(authService.registerEtudiant).mockResolvedValue({
      ...mockTokens,
      user: { id: 'etu-1', role: 'etudiant', email: 'etu@test.bf' },
    });

    const res = await request(app)
      .post('/api/v1/auth/register/etudiant')
      .send({
        email: 'etu@test.bf',
        password: 'Password123!',
        nom_complet: 'Test Etudiant',
        numero_ine: 'BF2300001',
        universite_id: 'univ-uuid-1234',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
  });

  it('retourne 400 si INE manquant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/etudiant')
      .send({
        email: 'etu@test.bf',
        password: 'Password123!',
        nom_complet: 'Test Etudiant',
        universite_id: 'univ-uuid-1234',
      });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne 200 avec un refresh token valide', async () => {
    vi.mocked(authService.refreshToken).mockResolvedValue(mockTokens);

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

describe('GET /health', () => {
  it('retourne 200 avec le statut ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
  });
});
