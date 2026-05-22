import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as minService from '../src/services/ministere.service';
import * as minRepo from '../src/repositories/ministere.repository';
import * as notifRepo from '../src/repositories/notification.repository';
import * as auditRepo from '../src/repositories/audit.repository';
import { NotFoundError, ValidationError } from '../src/utils/errors';

vi.mock('../src/repositories/ministere.repository');
vi.mock('../src/repositories/notification.repository');
vi.mock('../src/repositories/audit.repository');
vi.mock('../src/repositories/publications.repository', () => ({
  findByUniversite: vi.fn().mockResolvedValue([]),
  findSignalements: vi.fn().mockResolvedValue([]),
  updateSignalementStatut: vi.fn().mockResolvedValue(undefined),
  updateModerationResult: vi.fn().mockResolvedValue(undefined),
}));

const MIN_ID  = 'min-111';
const UNIV_ID = 'univ-222';
const SIG_ID  = 'sig-333';

const mockUniv = (overrides = {}) => ({ id: UNIV_ID, statut: 'en_attente', ...overrides });

beforeEach(() => { vi.clearAllMocks(); });

// ── approuverUniversite ──────────────────────────────────────────────────────

describe('approuverUniversite', () => {
  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(null);
    await expect(minService.approuverUniversite(MIN_ID, UNIV_ID)).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError si statut != en_attente', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv({ statut: 'approuvee' }) as never);
    await expect(minService.approuverUniversite(MIN_ID, UNIV_ID)).rejects.toThrow(ValidationError);
  });

  it('approuve l\'université avec succès (sans message)', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv() as never);
    vi.mocked(minRepo.updateUniversiteStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(minService.approuverUniversite(MIN_ID, UNIV_ID)).resolves.toBeUndefined();
  });

  it('approuve avec un message personnalisé', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv() as never);
    vi.mocked(minRepo.updateUniversiteStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(minService.approuverUniversite(MIN_ID, UNIV_ID, 'Bienvenue !')).resolves.toBeUndefined();
  });
});

// ── rejeterUniversite ────────────────────────────────────────────────────────

describe('rejeterUniversite', () => {
  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(null);
    await expect(minService.rejeterUniversite(MIN_ID, UNIV_ID, 'motif')).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError si statut != en_attente', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv({ statut: 'approuvee' }) as never);
    await expect(minService.rejeterUniversite(MIN_ID, UNIV_ID, 'motif')).rejects.toThrow(ValidationError);
  });

  it('rejette l\'université avec succès', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv() as never);
    vi.mocked(minRepo.updateUniversiteStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(minService.rejeterUniversite(MIN_ID, UNIV_ID, 'Dossier insuffisant')).resolves.toBeUndefined();
  });
});

// ── suspendreUniversite ──────────────────────────────────────────────────────

describe('suspendreUniversite', () => {
  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(null);
    await expect(minService.suspendreUniversite(MIN_ID, UNIV_ID, 'motif')).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError si statut != approuvee', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv({ statut: 'en_attente' }) as never);
    await expect(minService.suspendreUniversite(MIN_ID, UNIV_ID, 'motif')).rejects.toThrow(ValidationError);
  });

  it('suspend l\'université avec succès', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv({ statut: 'approuvee' }) as never);
    vi.mocked(minRepo.updateUniversiteStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(minService.suspendreUniversite(MIN_ID, UNIV_ID, 'motif')).resolves.toBeUndefined();
  });
});

// ── reactiverUniversite ──────────────────────────────────────────────────────

describe('reactiverUniversite', () => {
  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(null);
    await expect(minService.reactiverUniversite(MIN_ID, UNIV_ID)).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError si statut != suspendue', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv({ statut: 'approuvee' }) as never);
    await expect(minService.reactiverUniversite(MIN_ID, UNIV_ID)).rejects.toThrow(ValidationError);
  });

  it('réactive l\'université avec succès', async () => {
    vi.mocked(minRepo.findUniversiteById).mockResolvedValue(mockUniv({ statut: 'suspendue' }) as never);
    vi.mocked(minRepo.updateUniversiteStatut).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    vi.mocked(auditRepo.createAuditLog).mockResolvedValue(undefined as never);
    await expect(minService.reactiverUniversite(MIN_ID, UNIV_ID)).resolves.toBeUndefined();
  });
});

// ── getDashboard ─────────────────────────────────────────────────────────────

describe('getDashboard', () => {
  it('retourne les données du dashboard', async () => {
    const result = await minService.getDashboard();
    expect(result).toHaveProperty('statistiques');
    expect(result).toHaveProperty('universites_recentes');
    expect(result).toHaveProperty('publications_recentes');
  });
});

// ── listUniversites ───────────────────────────────────────────────────────────

describe('listUniversites', () => {
  it('retourne une page vide', async () => {
    const result = await minService.listUniversites({ limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('has_more');
  });
});

// ── getUniversiteDossier ─────────────────────────────────────────────────────

describe('getUniversiteDossier', () => {
  it('throws NotFoundError si université introuvable', async () => {
    await expect(minService.getUniversiteDossier(UNIV_ID)).rejects.toThrow(NotFoundError);
  });
});

// ── getStatistiques ──────────────────────────────────────────────────────────

describe('getStatistiques', () => {
  it('retourne les statistiques', async () => {
    const result = await minService.getStatistiques();
    expect(result).toHaveProperty('global');
    expect(result).toHaveProperty('evolution_mensuelle');
  });
});

// ── getCarte ─────────────────────────────────────────────────────────────────

describe('getCarte', () => {
  it('retourne une liste', async () => {
    const result = await minService.getCarte();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── getStatistiquesNationales ─────────────────────────────────────────────────

describe('getStatistiquesNationales', () => {
  it('retourne les stats nationales', async () => {
    const result = await minService.getStatistiquesNationales();
    expect(result).toHaveProperty('global');
  });
});

// ── getStatistiquesParRegion ──────────────────────────────────────────────────

describe('getStatistiquesParRegion', () => {
  it('retourne un tableau groupé par région', async () => {
    const result = await minService.getStatistiquesParRegion();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── traiterSignalement ────────────────────────────────────────────────────────

describe('traiterSignalement', () => {
  it('traite un signalement avec action supprimer', async () => {
    await expect(minService.traiterSignalement(SIG_ID, MIN_ID, 'supprimer')).resolves.toBeUndefined();
  });

  it('traite un signalement avec action innocenter', async () => {
    await expect(minService.traiterSignalement(SIG_ID, MIN_ID, 'innocenter')).resolves.toBeUndefined();
  });

  it('traite un signalement avec action avertir', async () => {
    await expect(minService.traiterSignalement(SIG_ID, MIN_ID, 'avertir')).resolves.toBeUndefined();
  });
});
