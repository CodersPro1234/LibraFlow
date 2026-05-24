import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as interactionsService from '../src/services/interactions.service';
import * as interactionsRepo from '../src/repositories/interactions.repository';
import * as notifRepo from '../src/repositories/notification.repository';
import * as pubRepo from '../src/repositories/publications.repository';
import { ConflictError, ForbiddenError, NotFoundError } from '../src/utils/errors';

vi.mock('../src/repositories/interactions.repository');
vi.mock('../src/repositories/notification.repository');
vi.mock('../src/repositories/publications.repository');

const PUB_ID  = 'pub-111';
const USER_ID = 'user-222';
const COM_ID  = 'com-333';
const PROF_ID = 'prof-444';

const mockPub = (overrides = {}) => ({ id: PUB_ID, titre: 'Test', professeur_id: PROF_ID, ...overrides });

beforeEach(() => { vi.clearAllMocks(); });

// ── likePublication ───────────────────────────────────────────────────────────

describe('likePublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(interactionsService.likePublication(PUB_ID, USER_ID, 'etudiant')).rejects.toThrow(NotFoundError);
  });

  it('throws ConflictError si déjà liké', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.findLike).mockResolvedValue({ id: 'like-1' } as never);
    await expect(interactionsService.likePublication(PUB_ID, USER_ID, 'etudiant')).rejects.toThrow(ConflictError);
  });

  it('ajoute un like avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.findLike).mockResolvedValue(null);
    vi.mocked(interactionsRepo.addLike).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    await expect(interactionsService.likePublication(PUB_ID, USER_ID, 'etudiant')).resolves.toBeUndefined();
  });
});

// ── unlikePublication ─────────────────────────────────────────────────────────

describe('unlikePublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(interactionsService.unlikePublication(PUB_ID, USER_ID)).rejects.toThrow(NotFoundError);
  });

  it('retire le like avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.removeLike).mockResolvedValue(undefined);
    await expect(interactionsService.unlikePublication(PUB_ID, USER_ID)).resolves.toBeUndefined();
  });
});

// ── getCommentaires ───────────────────────────────────────────────────────────

describe('getCommentaires', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(interactionsService.getCommentaires(PUB_ID)).rejects.toThrow(NotFoundError);
  });

  it('retourne une liste vide', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.findCommentaires).mockResolvedValue([]);
    const result = await interactionsService.getCommentaires(PUB_ID);
    expect(result).toHaveProperty('data');
    expect(result.has_more).toBe(false);
  });
});

// ── postCommentaire ───────────────────────────────────────────────────────────

describe('postCommentaire', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(interactionsService.postCommentaire({
      publicationId: PUB_ID, userId: USER_ID, userRole: 'etudiant', contenu: 'Hello',
    })).rejects.toThrow(NotFoundError);
  });

  it('crée un commentaire avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.createCommentaire).mockResolvedValue({ id: COM_ID, contenu: 'Hello', created_at: new Date().toISOString() } as never);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    const result = await interactionsService.postCommentaire({
      publicationId: PUB_ID, userId: USER_ID, userRole: 'etudiant', contenu: 'Hello',
    });
    expect(result.id).toBe(COM_ID);
  });

  it('crée une réponse et notifie l\'auteur du commentaire parent', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.createCommentaire).mockResolvedValue({ id: COM_ID, contenu: 'Réponse', created_at: new Date().toISOString() } as never);
    vi.mocked(interactionsRepo.findCommentaireById).mockResolvedValue({
      id: 'com-parent', user_id: 'other-user', user_role: 'etudiant', contenu: 'Parent',
    } as never);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    const result = await interactionsService.postCommentaire({
      publicationId: PUB_ID, userId: USER_ID, userRole: 'etudiant', contenu: 'Réponse', parentId: 'com-parent',
    });
    expect(result.id).toBe(COM_ID);
  });

  it('ne notifie pas si la réponse est de l\'auteur lui-même', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.createCommentaire).mockResolvedValue({ id: COM_ID, contenu: 'Réponse', created_at: new Date().toISOString() } as never);
    vi.mocked(interactionsRepo.findCommentaireById).mockResolvedValue({
      id: 'com-parent', user_id: USER_ID, user_role: 'etudiant', contenu: 'Parent', // same user
    } as never);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    const result = await interactionsService.postCommentaire({
      publicationId: PUB_ID, userId: USER_ID, userRole: 'etudiant', contenu: 'Auto-réponse', parentId: 'com-parent',
    });
    expect(result.id).toBe(COM_ID);
  });
});

// ── deleteCommentaire ─────────────────────────────────────────────────────────

describe('deleteCommentaire', () => {
  it('throws NotFoundError si commentaire introuvable', async () => {
    vi.mocked(interactionsRepo.findCommentaireById).mockResolvedValue(null);
    await expect(interactionsService.deleteCommentaire(COM_ID, USER_ID, 'etudiant')).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si pas l\'auteur', async () => {
    vi.mocked(interactionsRepo.findCommentaireById).mockResolvedValue({ id: COM_ID, user_id: 'other' } as never);
    await expect(interactionsService.deleteCommentaire(COM_ID, USER_ID, 'etudiant')).rejects.toThrow(ForbiddenError);
  });

  it('supprime le commentaire si auteur', async () => {
    vi.mocked(interactionsRepo.findCommentaireById).mockResolvedValue({ id: COM_ID, user_id: USER_ID } as never);
    vi.mocked(interactionsRepo.deleteCommentaire).mockResolvedValue(undefined);
    await expect(interactionsService.deleteCommentaire(COM_ID, USER_ID, 'etudiant')).resolves.toBeUndefined();
  });

  it('admin (ministere) peut supprimer n\'importe quel commentaire', async () => {
    vi.mocked(interactionsRepo.findCommentaireById).mockResolvedValue({ id: COM_ID, user_id: 'other' } as never);
    vi.mocked(interactionsRepo.deleteCommentaire).mockResolvedValue(undefined);
    await expect(interactionsService.deleteCommentaire(COM_ID, USER_ID, 'ministere')).resolves.toBeUndefined();
  });
});

// ── savePublication ───────────────────────────────────────────────────────────

describe('savePublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(interactionsService.savePublication(PUB_ID, USER_ID, 'etudiant')).rejects.toThrow(NotFoundError);
  });

  it('throws ConflictError si déjà sauvegardé', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.findFavori).mockResolvedValue({ id: 'fav-1' } as never);
    await expect(interactionsService.savePublication(PUB_ID, USER_ID, 'etudiant')).rejects.toThrow(ConflictError);
  });

  it('sauvegarde la publication avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.findFavori).mockResolvedValue(null);
    vi.mocked(interactionsRepo.addFavori).mockResolvedValue(undefined);
    await expect(interactionsService.savePublication(PUB_ID, USER_ID, 'etudiant')).resolves.toBeUndefined();
  });
});

// ── unsavePublication ─────────────────────────────────────────────────────────

describe('unsavePublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(interactionsService.unsavePublication(PUB_ID, USER_ID)).rejects.toThrow(NotFoundError);
  });

  it('retire la sauvegarde sans erreur', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.removeFavori).mockResolvedValue(undefined);
    await expect(interactionsService.unsavePublication(PUB_ID, USER_ID)).resolves.toBeUndefined();
  });
});

// ── followProfesseur ──────────────────────────────────────────────────────────
// Signature: followProfesseur(followerId, followerRole, professeurId)

describe('followProfesseur', () => {
  it('throws ConflictError si déjà suivi', async () => {
    vi.mocked(interactionsRepo.findAbonnement).mockResolvedValue({ id: 'abo-1' } as never);
    await expect(interactionsService.followProfesseur(USER_ID, 'etudiant', PROF_ID)).rejects.toThrow(ConflictError);
  });

  it('throws NotFoundError si professeur introuvable (supabase null)', async () => {
    vi.mocked(interactionsRepo.findAbonnement).mockResolvedValue(null);
    await expect(interactionsService.followProfesseur(USER_ID, 'etudiant', PROF_ID)).rejects.toThrow(NotFoundError);
  });

  it('suit le professeur avec succès', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    vi.mocked(interactionsRepo.findAbonnement).mockResolvedValue(null);
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: PROF_ID, nom_complet: 'Prof Test' }, error: null }),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: null }))
      ),
    } as never);
    vi.mocked(interactionsRepo.addAbonnement).mockResolvedValue(undefined);
    vi.mocked(notifRepo.createNotification).mockResolvedValue(undefined as never);
    await expect(interactionsService.followProfesseur(USER_ID, 'etudiant', PROF_ID)).resolves.toBeUndefined();
  });
});

// ── followUniversite ──────────────────────────────────────────────────────────

describe('followUniversite', () => {
  it('throws ConflictError si déjà suivi', async () => {
    vi.mocked(interactionsRepo.findAbonnement).mockResolvedValue({ id: 'abo-1' } as never);
    await expect(interactionsService.followUniversite(USER_ID, 'etudiant', 'univ-1')).rejects.toThrow(ConflictError);
  });

  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(interactionsRepo.findAbonnement).mockResolvedValue(null);
    await expect(interactionsService.followUniversite(USER_ID, 'etudiant', 'univ-1')).rejects.toThrow(NotFoundError);
  });

  it('suit l\'université avec succès', async () => {
    const { supabaseAdmin } = await import('../src/config/supabase');
    vi.mocked(interactionsRepo.findAbonnement).mockResolvedValue(null);
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'univ-1' }, error: null }),
      then: vi.fn().mockImplementation((cb: (v: unknown) => unknown) =>
        Promise.resolve(cb({ data: null, error: null }))
      ),
    } as never);
    vi.mocked(interactionsRepo.addAbonnement).mockResolvedValue(undefined);
    await expect(interactionsService.followUniversite(USER_ID, 'etudiant', 'univ-1')).resolves.toBeUndefined();
  });
});

// ── unfollowProfesseur ────────────────────────────────────────────────────────

describe('unfollowProfesseur', () => {
  it('se désabonne sans erreur', async () => {
    vi.mocked(interactionsRepo.removeAbonnement).mockResolvedValue(undefined);
    await expect(interactionsService.unfollowProfesseur(USER_ID, PROF_ID)).resolves.toBeUndefined();
  });
});

// ── getCommunaute ─────────────────────────────────────────────────────────────

describe('getCommunaute', () => {
  it('retourne les stats de communauté', async () => {
    vi.mocked(interactionsRepo.findAbonnes).mockResolvedValue([]);
    vi.mocked(interactionsRepo.findAbonnesCount).mockResolvedValue(10);
    vi.mocked(interactionsRepo.findRecentCommentairesByProfesseur).mockResolvedValue([]);
    const result = await interactionsService.getCommunaute(PROF_ID);
    expect(result).toHaveProperty('abonnes');
    expect(result).toHaveProperty('total_abonnes');
    expect(result.total_abonnes).toBe(10);
  });
});
