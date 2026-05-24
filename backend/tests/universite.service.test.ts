import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as univService from '../src/services/universite.service';
import * as univRepo from '../src/repositories/universite.repository';
import * as notifRepo from '../src/repositories/notification.repository';
import * as auditRepo from '../src/repositories/audit.repository';
import * as pubRepo from '../src/repositories/publications.repository';
import { supabaseAdmin } from '../src/config/supabase';
import { ForbiddenError, NotFoundError, ValidationError } from '../src/utils/errors';

vi.mock('../src/repositories/universite.repository');
vi.mock('../src/repositories/notification.repository');
vi.mock('../src/repositories/audit.repository');
vi.mock('../src/repositories/publications.repository', () => ({
  findByUniversite: vi.fn().mockResolvedValue([]),
  findSignalements: vi.fn().mockResolvedValue([]),
}));

const UNIV_ID = 'univ-111';
const PROF_ID = 'prof-222';
const ETU_ID  = 'etu-333';
const PUB_ID  = 'pub-444';

const mockProf = (overrides = {}) => ({ id: PROF_ID, universite_id: UNIV_ID, statut: 'en_attente', ...overrides });

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

// ── validerProfesseur ────────────────────────────────────────────────────────

describe('validerProfesseur', () => {
  it('throws NotFoundError si professeur introuvable', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(null);
    await expect(univService.validerProfesseur(UNIV_ID, PROF_ID)).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si professeur hors université', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ universite_id: 'other' }) as never);
    await expect(univService.validerProfesseur(UNIV_ID, PROF_ID)).rejects.toThrow(ForbiddenError);
  });

  it('throws ValidationError si statut != en_attente', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ statut: 'actif' }) as never);
    await expect(univService.validerProfesseur(UNIV_ID, PROF_ID)).rejects.toThrow(ValidationError);
  });

  it('valide le professeur avec succès', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf() as never);
    vi.mocked(univRepo.updateProfesseurStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(univService.validerProfesseur(UNIV_ID, PROF_ID)).resolves.toBeUndefined();
  });
});

// ── rejeterProfesseur ────────────────────────────────────────────────────────

describe('rejeterProfesseur', () => {
  it('throws NotFoundError si professeur introuvable', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(null);
    await expect(univService.rejeterProfesseur(UNIV_ID, PROF_ID, 'motif')).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si professeur hors université', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ universite_id: 'other' }) as never);
    await expect(univService.rejeterProfesseur(UNIV_ID, PROF_ID, 'motif')).rejects.toThrow(ForbiddenError);
  });

  it('throws ValidationError si statut != en_attente', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ statut: 'rejete' }) as never);
    await expect(univService.rejeterProfesseur(UNIV_ID, PROF_ID, 'motif')).rejects.toThrow(ValidationError);
  });

  it('rejette le professeur avec succès', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf() as never);
    vi.mocked(univRepo.updateProfesseurStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(univService.rejeterProfesseur(UNIV_ID, PROF_ID, 'Dossier incomplet')).resolves.toBeUndefined();
  });
});

// ── suspendreProfesseur ──────────────────────────────────────────────────────

describe('suspendreProfesseur', () => {
  it('throws NotFoundError si professeur introuvable', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(null);
    await expect(univService.suspendreProfesseur(UNIV_ID, PROF_ID, 'motif')).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si professeur hors université', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ universite_id: 'other', statut: 'actif' }) as never);
    await expect(univService.suspendreProfesseur(UNIV_ID, PROF_ID, 'motif')).rejects.toThrow(ForbiddenError);
  });

  it('throws ValidationError si statut != actif', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ statut: 'suspendu' }) as never);
    await expect(univService.suspendreProfesseur(UNIV_ID, PROF_ID, 'motif')).rejects.toThrow(ValidationError);
  });

  it('suspend le professeur avec succès', async () => {
    vi.mocked(univRepo.findProfesseurById).mockResolvedValue(mockProf({ statut: 'actif' }) as never);
    vi.mocked(univRepo.updateProfesseurStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(univService.suspendreProfesseur(UNIV_ID, PROF_ID, 'motif')).resolves.toBeUndefined();
  });
});

// ── getDashboard ─────────────────────────────────────────────────────────────

describe('getDashboard', () => {
  it('retourne le dashboard avec données par défaut', async () => {
    const result = await univService.getDashboard(UNIV_ID);
    expect(result).toHaveProperty('statistiques');
    expect(result).toHaveProperty('professeurs_en_attente');
    expect(result).toHaveProperty('publications_recentes');
  });
});

// ── listProfesseurs ──────────────────────────────────────────────────────────

describe('listProfesseurs', () => {
  it('retourne une page vide', async () => {
    const result = await univService.listProfesseurs({ universiteId: UNIV_ID, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('has_more');
    expect(result.has_more).toBe(false);
  });

  it('accepte les filtres statut et cursor', async () => {
    const result = await univService.listProfesseurs({
      universiteId: UNIV_ID,
      statut: 'en_attente',
      cursor: '2024-01-01',
      limit: 10,
    });
    expect(result).toHaveProperty('data');
  });
});

// ── listEtudiants ────────────────────────────────────────────────────────────

describe('listEtudiants', () => {
  it('retourne une page vide', async () => {
    const result = await univService.listEtudiants({ universiteId: UNIV_ID, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result.has_more).toBe(false);
  });

  it('accepte un cursor', async () => {
    const result = await univService.listEtudiants({ universiteId: UNIV_ID, cursor: '2024-01-01', limit: 10 });
    expect(result).toHaveProperty('data');
  });
});

// ── suspendreEtudiant ────────────────────────────────────────────────────────

describe('suspendreEtudiant', () => {
  it('throws NotFoundError si étudiant introuvable', async () => {
    await expect(univService.suspendreEtudiant(UNIV_ID, ETU_ID, 'motif')).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si étudiant hors université', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, universite_id: 'other', statut: 'actif' }) as never
    );
    await expect(univService.suspendreEtudiant(UNIV_ID, ETU_ID, 'motif')).rejects.toThrow(ForbiddenError);
  });

  it('throws ValidationError si étudiant non actif', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, universite_id: UNIV_ID, statut: 'suspendu' }) as never
    );
    await expect(univService.suspendreEtudiant(UNIV_ID, ETU_ID, 'motif')).rejects.toThrow(ValidationError);
  });

  it('suspend l\'étudiant avec succès', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, universite_id: UNIV_ID, statut: 'actif' }) as never
    );
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(univService.suspendreEtudiant(UNIV_ID, ETU_ID, 'motif')).resolves.toBeUndefined();
  });
});

// ── reactiverEtudiant ────────────────────────────────────────────────────────

describe('reactiverEtudiant', () => {
  it('throws NotFoundError si étudiant introuvable', async () => {
    await expect(univService.reactiverEtudiant(UNIV_ID, ETU_ID)).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si étudiant hors université', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, universite_id: 'other', statut: 'suspendu' }) as never
    );
    await expect(univService.reactiverEtudiant(UNIV_ID, ETU_ID)).rejects.toThrow(ForbiddenError);
  });

  it('throws ValidationError si étudiant non suspendu', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, universite_id: UNIV_ID, statut: 'actif' }) as never
    );
    await expect(univService.reactiverEtudiant(UNIV_ID, ETU_ID)).rejects.toThrow(ValidationError);
  });

  it('réactive l\'étudiant avec succès', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: ETU_ID, universite_id: UNIV_ID, statut: 'suspendu' }) as never
    );
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(univService.reactiverEtudiant(UNIV_ID, ETU_ID)).resolves.toBeUndefined();
  });
});

// ── supprimerPublication ─────────────────────────────────────────────────────

describe('supprimerPublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    await expect(univService.supprimerPublication(UNIV_ID, PUB_ID)).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si publication hors université', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: PUB_ID, universite_id: 'other' }) as never
    );
    await expect(univService.supprimerPublication(UNIV_ID, PUB_ID)).rejects.toThrow(ForbiddenError);
  });

  it('supprime la publication avec succès', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce(
      mockFromWithMaybeSingle({ id: PUB_ID, universite_id: UNIV_ID }) as never
    );
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(univService.supprimerPublication(UNIV_ID, PUB_ID)).resolves.toBeUndefined();
  });
});

// ── getTopPublications ───────────────────────────────────────────────────────

describe('getTopPublications', () => {
  it('retourne une liste vide par défaut', async () => {
    const result = await univService.getTopPublications(UNIV_ID);
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── getEvolutionMensuelle ────────────────────────────────────────────────────

describe('getEvolutionMensuelle', () => {
  it('retourne une liste (ou vide si vue indisponible)', async () => {
    const result = await univService.getEvolutionMensuelle(UNIV_ID);
    expect(Array.isArray(result)).toBe(true);
  });

  it('retourne [] si supabase retourne une erreur', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: { message: 'View not ready' } }))
      ),
    } as never);
    const result = await univService.getEvolutionMensuelle(UNIV_ID);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});

// ── listPublications ─────────────────────────────────────────────────────────

describe('listPublications', () => {
  it('retourne une page vide', async () => {
    vi.mocked(pubRepo.findByUniversite).mockResolvedValue([]);
    const result = await univService.listPublications({ universiteId: UNIV_ID, limit: 20 });
    expect(result.has_more).toBe(false);
    expect(result.cursor_next).toBeNull();
  });

  it('retourne has_more = true si plus d\'éléments', async () => {
    const fakePubs = Array.from({ length: 21 }, (_, i) => ({
      id: `pub-${i}`,
      created_at: new Date(Date.now() - i * 1000).toISOString(),
    }));
    vi.mocked(pubRepo.findByUniversite).mockResolvedValue(fakePubs as never);
    const result = await univService.listPublications({ universiteId: UNIV_ID, limit: 20 });
    expect(result.has_more).toBe(true);
    expect(result.cursor_next).not.toBeNull();
  });
});
