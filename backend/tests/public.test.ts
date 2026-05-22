import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import * as pubService from '../src/services/publications.service';

vi.mock('../src/services/publications.service');

const UNIV_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const PROF_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
const TOKEN   = 'share-token-abc123';

describe('GET /api/v1/public/universites', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la liste des universités publiques', async () => {
    const res = await request(app).get('/api/v1/public/universites');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('GET /api/v1/public/universites/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 404 si université introuvable (supabase renvoie null)', async () => {
    const res = await request(app).get(`/api/v1/public/universites/${UNIV_ID}`);
    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/public/professeurs/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 404 si professeur introuvable', async () => {
    const res = await request(app).get(`/api/v1/public/professeurs/${PROF_ID}`);
    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/public/share/:token', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('retourne 200 avec la publication partagée', async () => {
    vi.mocked(pubService.getSharedPublication).mockResolvedValue({ id: 'pub-1', titre: 'Test' } as never);
    const res = await request(app).get(`/api/v1/public/share/${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('retourne 404 si token invalide', async () => {
    vi.mocked(pubService.getSharedPublication).mockRejectedValue(
      Object.assign(new Error('Lien invalide'), { statusCode: 404, code: 'NOT_FOUND' })
    );
    const res = await request(app).get(`/api/v1/public/share/invalid-token`);
    expect(res.status).toBe(404);
  });
});
