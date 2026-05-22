import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as meService from '../src/services/me.service';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../src/config/supabase';
import { AuthError, NotFoundError, ValidationError } from '../src/utils/errors';

vi.mock('bcryptjs');

const ETU_ID  = 'etu-111';
const PROF_ID = 'prof-222';
const PUB_ID  = 'pub-333';

beforeEach(() => { vi.clearAllMocks(); });

function mockFromWithMaybeSingle(data: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
    then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
      Promise.resolve(cb({ data: null, error: null }))
    ),
  };
}

// ── getProfile ────────────────────────────────────────────────────────────────

describe('getProfile', () => {
  it('throws NotFoundError pour etudiant introuvable', async () => {
    await expect(meService.getProfile(ETU_ID, 'etudiant')).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError pour professeur introuvable', async () => {
    await expect(meService.getProfile(PROF_ID, 'professeur')).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError pour universite introuvable', async () => {
    await expect(meService.getProfile('univ-1', 'universite')).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError pour ministere introuvable', async () => {
    await expect(meService.getProfile('min-1', 'ministere')).rejects.toThrow(NotFoundError);
  });
});

// ── updateProfile ─────────────────────────────────────────────────────────────

describe('updateProfile', () => {
  it('throws ValidationError si rôle non supporté', async () => {
    await expect(meService.updateProfile('univ-1', 'universite', {})).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError si rôle ministere', async () => {
    await expect(meService.updateProfile('min-1', 'ministere', {})).rejects.toThrow(ValidationError);
  });

  it('retourne sans rien faire si patch vide', async () => {
    await expect(meService.updateProfile(PROF_ID, 'professeur', {})).resolves.toBeUndefined();
  });

  it('met à jour le nom_complet du professeur', async () => {
    await expect(
      meService.updateProfile(PROF_ID, 'professeur', { nom_complet: 'Prof Test' })
    ).resolves.toBeUndefined();
  });

  it('met à jour les matieres du professeur', async () => {
    await expect(
      meService.updateProfile(PROF_ID, 'professeur', { matieres: ['Maths', 'Physique'] })
    ).resolves.toBeUndefined();
  });

  it('met à jour le nom_complet de l\'étudiant', async () => {
    await expect(
      meService.updateProfile(ETU_ID, 'etudiant', { nom_complet: 'Etudiant Test' })
    ).resolves.toBeUndefined();
  });
});

// ── changePassword ────────────────────────────────────────────────────────────

describe('changePassword', () => {
  it('throws NotFoundError si profil introuvable', async () => {
    await expect(meService.changePassword(ETU_ID, 'etudiant', 'old', 'new123!')).rejects.toThrow(NotFoundError);
  });

  it('throws AuthError si mot de passe incorrect', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, password_hash: '$2a$hash' }) as never
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
    await expect(
      meService.changePassword(ETU_ID, 'etudiant', 'wrong', 'new123!')
    ).rejects.toThrow(AuthError);
  });

  it('change le mot de passe avec succès', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, password_hash: '$2a$hash' }) as never
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('$2a$newHash' as never);
    await expect(
      meService.changePassword(ETU_ID, 'etudiant', 'oldPass', 'new123!')
    ).resolves.toBeUndefined();
  });

  it('fonctionne pour le rôle ministere', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: 'min-1', password_hash: '$2a$hash' }) as never
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('$2a$newHash' as never);
    await expect(
      meService.changePassword('min-1', 'ministere', 'oldPass', 'new123!')
    ).resolves.toBeUndefined();
  });
});

// ── getMesPublicationsStats ───────────────────────────────────────────────────

describe('getMesPublicationsStats', () => {
  it('retourne des stats agrégées vides', async () => {
    const result = await meService.getMesPublicationsStats(PROF_ID);
    expect(result).toHaveProperty('total_publications');
    expect(result).toHaveProperty('total_vues');
    expect(result).toHaveProperty('total_likes');
    expect(result.total_publications).toBe(0);
  });
});

// ── getHistorique ─────────────────────────────────────────────────────────────

describe('getHistorique', () => {
  it('retourne une page vide', async () => {
    const result = await meService.getHistorique(ETU_ID);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('has_more');
  });

  it('accepte un cursor de pagination', async () => {
    const result = await meService.getHistorique(ETU_ID, '2024-01-01');
    expect(result).toHaveProperty('data');
  });
});

// ── addHistorique ─────────────────────────────────────────────────────────────

describe('addHistorique', () => {
  it('s\'exécute sans erreur', async () => {
    await expect(meService.addHistorique(ETU_ID, PUB_ID, 'vue')).resolves.toBeUndefined();
  });

  it('accepte le type telecharge', async () => {
    await expect(meService.addHistorique(ETU_ID, PUB_ID, 'telecharge')).resolves.toBeUndefined();
  });

  it('accepte le type ecoute', async () => {
    await expect(meService.addHistorique(ETU_ID, PUB_ID, 'ecoute')).resolves.toBeUndefined();
  });
});

// ── getDownloads ──────────────────────────────────────────────────────────────

describe('getDownloads', () => {
  it('retourne une page vide', async () => {
    const result = await meService.getDownloads(ETU_ID);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('has_more');
  });
});

// ── getAbonnes ────────────────────────────────────────────────────────────────

describe('getAbonnes', () => {
  it('retourne une page vide', async () => {
    const result = await meService.getAbonnes(PROF_ID);
    expect(result).toHaveProperty('data');
  });
});

// ── getInteractionsRecentes ───────────────────────────────────────────────────

describe('getInteractionsRecentes', () => {
  it('retourne des données', async () => {
    const result = await meService.getInteractionsRecentes(PROF_ID);
    expect(result).toBeDefined();
  });
});
