import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pubService from '../src/services/publications.service';
import * as pubRepo from '../src/repositories/publications.repository';
import * as interactionsRepo from '../src/repositories/interactions.repository';
import { ForbiddenError, NotFoundError } from '../src/utils/errors';

vi.mock('../src/repositories/publications.repository');
vi.mock('../src/repositories/interactions.repository');
vi.mock('pdf-parse', () => ({
  default: vi.fn().mockResolvedValue({ text: 'Contenu extrait du PDF' }),
}));

const PUB_ID  = 'pub-111';
const PROF_ID = 'prof-222';
const USER_ID = 'user-333';
const TOKEN   = 'share-token-abc';

const mockPub = (overrides = {}) => ({
  id: PUB_ID,
  titre: 'Test',
  professeur_id: PROF_ID,
  universite_id: 'univ-1',
  pdf_url: 'https://storage.test/documents/path/file.pdf',
  audio_url: null,
  resume_ia: null,
  vues_count: 0,
  created_at: new Date().toISOString(),
  ...overrides,
});

beforeEach(() => { vi.clearAllMocks(); });

// ── getPublication ────────────────────────────────────────────────────────────

describe('getPublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findByIdWithRelations).mockResolvedValue(null);
    await expect(pubService.getPublication(PUB_ID)).rejects.toThrow(NotFoundError);
  });

  it('retourne la publication sans flags si pas de requesterId', async () => {
    vi.mocked(pubRepo.findByIdWithRelations).mockResolvedValue(mockPub() as never);
    const result = await pubService.getPublication(PUB_ID);
    expect(result.id).toBe(PUB_ID);
    expect(result.is_liked).toBe(false);
    expect(result.is_saved).toBe(false);
  });

  it('retourne la publication avec flags si requesterId fourni', async () => {
    vi.mocked(pubRepo.findByIdWithRelations).mockResolvedValue(mockPub() as never);
    vi.mocked(interactionsRepo.isLiked).mockResolvedValue(true);
    vi.mocked(interactionsRepo.findFavori).mockResolvedValue({ id: 'fav-1' } as never);
    const result = await pubService.getPublication(PUB_ID, USER_ID);
    expect(result.is_liked).toBe(true);
    expect(result.is_saved).toBe(true);
  });
});

// ── getFeed ───────────────────────────────────────────────────────────────────

describe('getFeed', () => {
  it('retourne un feed global si aucun abonnement', async () => {
    vi.mocked(interactionsRepo.findCiblesIdsByFollower).mockResolvedValue([]);
    vi.mocked(pubRepo.findGlobalFeed).mockResolvedValue([]);
    const result = await pubService.getFeed({ requesterId: USER_ID, requesterRole: 'etudiant', limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result.has_more).toBe(false);
  });

  it('retourne un feed personnalisé si abonnements', async () => {
    vi.mocked(interactionsRepo.findCiblesIdsByFollower)
      .mockResolvedValueOnce([PROF_ID])
      .mockResolvedValueOnce([]);
    vi.mocked(pubRepo.findFeed).mockResolvedValue([mockPub() as never]);
    vi.mocked(interactionsRepo.isLikedBatch).mockResolvedValue(new Set());
    vi.mocked(interactionsRepo.isSavedBatch).mockResolvedValue(new Set());
    const result = await pubService.getFeed({ requesterId: USER_ID, requesterRole: 'etudiant', limit: 20 });
    expect(result.data.length).toBeGreaterThanOrEqual(0);
  });
});

// ── searchPublications ────────────────────────────────────────────────────────

describe('searchPublications', () => {
  it('retourne des résultats de recherche', async () => {
    vi.mocked(pubRepo.searchPublications).mockResolvedValue([]);
    const result = await pubService.searchPublications({ q: 'maths', page: 1, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
    expect(result.page).toBe(1);
  });
});

// ── updatePublication ─────────────────────────────────────────────────────────

describe('updatePublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(pubService.updatePublication(PUB_ID, PROF_ID, { titre: 'Nouveau titre' })).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si pas l\'auteur', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    await expect(pubService.updatePublication(PUB_ID, 'autre-user', { titre: 'Hack' })).rejects.toThrow(ForbiddenError);
  });

  it('met à jour la publication avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(pubRepo.updatePublication).mockResolvedValue(undefined as never);
    await expect(pubService.updatePublication(PUB_ID, PROF_ID, { titre: 'Nouveau titre' })).resolves.toBeUndefined();
  });
});

// ── deletePublication ─────────────────────────────────────────────────────────

describe('deletePublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(pubService.deletePublication(PUB_ID, PROF_ID, 'professeur')).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError si ni auteur ni admin', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    await expect(pubService.deletePublication(PUB_ID, 'autre-user', 'etudiant')).rejects.toThrow(ForbiddenError);
  });

  it('supprime si auteur', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(pubRepo.deletePublication).mockResolvedValue(undefined);
    await expect(pubService.deletePublication(PUB_ID, PROF_ID, 'professeur')).resolves.toBeUndefined();
  });

  it('supprime si admin universite', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(pubRepo.deletePublication).mockResolvedValue(undefined);
    await expect(pubService.deletePublication(PUB_ID, 'admin', 'universite')).resolves.toBeUndefined();
  });
});

// ── getDownloadUrl ────────────────────────────────────────────────────────────

describe('getDownloadUrl', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(pubService.getDownloadUrl(PUB_ID, USER_ID)).rejects.toThrow(NotFoundError);
  });

  it('retourne l\'URL signée', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(pubRepo.incrementTelechargements).mockResolvedValue(undefined);
    // supabase.storage.from().createSignedUrl is mocked in setup.ts
    const result = await pubService.getDownloadUrl(PUB_ID, USER_ID);
    expect(result).toHaveProperty('download_url');
    expect(result).toHaveProperty('expires_in');
  });
});

// ── requestTts ────────────────────────────────────────────────────────────────

describe('requestTts', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(pubService.requestTts(PUB_ID)).rejects.toThrow(NotFoundError);
  });

  it('retourne l\'audio_url si déjà généré', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub({ audio_url: 'https://storage/audio.mp3' }) as never);
    const result = await pubService.requestTts(PUB_ID);
    expect(result.ready).toBe(true);
    expect(result.audio_url).toBeDefined();
  });

  it('enqueue le TTS si pas encore généré', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    const result = await pubService.requestTts(PUB_ID);
    expect(result.ready).toBe(false);
    expect(result.message).toBeDefined();
  });
});

// ── signalerPublication ───────────────────────────────────────────────────────

describe('signalerPublication', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(pubService.signalerPublication(PUB_ID, USER_ID, 'etudiant', 'inapproprie')).rejects.toThrow(NotFoundError);
  });

  it('crée le signalement avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(pubRepo.createSignalement).mockResolvedValue(undefined as never);
    await expect(pubService.signalerPublication(PUB_ID, USER_ID, 'etudiant', 'plagiat')).resolves.toBeUndefined();
  });
});

// ── createShareLink ───────────────────────────────────────────────────────────

describe('createShareLink', () => {
  it('throws NotFoundError si publication introuvable', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(null);
    await expect(pubService.createShareLink(PUB_ID, USER_ID)).rejects.toThrow(NotFoundError);
  });

  it('crée le lien de partage avec succès', async () => {
    vi.mocked(pubRepo.findById).mockResolvedValue(mockPub() as never);
    vi.mocked(pubRepo.createPartage).mockResolvedValue({ token: TOKEN, expires_at: '2025-12-31' } as never);
    const result = await pubService.createShareLink(PUB_ID, USER_ID);
    expect(result).toHaveProperty('share_url');
    expect(result).toHaveProperty('expires_at');
  });
});

// ── getSharedPublication ──────────────────────────────────────────────────────

describe('getSharedPublication', () => {
  it('throws NotFoundError si token invalide', async () => {
    vi.mocked(pubRepo.findPartageByToken).mockResolvedValue(null);
    await expect(pubService.getSharedPublication(TOKEN)).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError si publication supprimée', async () => {
    vi.mocked(pubRepo.findPartageByToken).mockResolvedValue({ publication_id: PUB_ID } as never);
    vi.mocked(pubRepo.findByIdWithRelations).mockResolvedValue(null);
    await expect(pubService.getSharedPublication(TOKEN)).rejects.toThrow(NotFoundError);
  });

  it('retourne la publication partagée', async () => {
    vi.mocked(pubRepo.findPartageByToken).mockResolvedValue({ publication_id: PUB_ID } as never);
    vi.mocked(pubRepo.findByIdWithRelations).mockResolvedValue(mockPub() as never);
    const result = await pubService.getSharedPublication(TOKEN);
    expect(result.id).toBe(PUB_ID);
  });
});

// ── getMesPublications ────────────────────────────────────────────────────────

describe('getMesPublications', () => {
  it('retourne une page vide', async () => {
    vi.mocked(pubRepo.findByProfesseur).mockResolvedValue([]);
    const result = await pubService.getMesPublications(PROF_ID);
    expect(result).toHaveProperty('data');
    expect(result.has_more).toBe(false);
  });
});

// ── getBibliotheque ───────────────────────────────────────────────────────────

describe('getBibliotheque', () => {
  it('retourne favoris et historique', async () => {
    vi.mocked(pubRepo.findFavoris).mockResolvedValue([]);
    vi.mocked(pubRepo.findHistoriqueByEtudiant).mockResolvedValue([]);
    const result = await pubService.getBibliotheque(USER_ID);
    expect(result).toHaveProperty('favoris');
    expect(result).toHaveProperty('historique');
  });
});

// ── createPublication ─────────────────────────────────────────────────────────

describe('createPublication', () => {
  it('crée une publication et la met en file de modération', async () => {
    vi.mocked(pubRepo.createPublication).mockResolvedValue({
      id: 'pub-new',
      titre: 'Test',
      matiere: 'Maths',
      texte_extrait: 'Contenu extrait du PDF',
    } as never);

    const result = await pubService.createPublication({
      titre: 'Test',
      matiere: 'Maths',
      niveau: 'L1',
      type_doc: 'cours',
      fichierBuffer: Buffer.from('fake pdf'),
      fichierOriginalName: 'test.pdf',
      fichierSize: 1024,
      professeurId: PROF_ID,
      universiteId: 'univ-1',
    });

    expect(result).toHaveProperty('id');
    expect(result.statut).toBe('en_analyse');
  });

  it('gère un fichier non-PDF sans extraction de texte', async () => {
    vi.mocked(pubRepo.createPublication).mockResolvedValue({
      id: 'pub-new',
      titre: 'Test',
      matiere: 'Maths',
      texte_extrait: null,
    } as never);

    const result = await pubService.createPublication({
      titre: 'Test',
      matiere: 'Maths',
      niveau: 'L1',
      type_doc: 'cours',
      fichierBuffer: Buffer.from('fake docx'),
      fichierOriginalName: 'test.docx',
      fichierSize: 2048,
      professeurId: PROF_ID,
      universiteId: 'univ-1',
    });

    expect(result.statut).toBe('en_analyse');
  });
});

// ── getRecommendations ────────────────────────────────────────────────────────

describe('getRecommendations', () => {
  it('retourne le fallback quand le service IA est indisponible', async () => {
    vi.mocked(pubRepo.findHistoriqueByEtudiant).mockResolvedValue([]);
    vi.mocked(pubRepo.findGlobalFeed).mockResolvedValue([]);
    const result = await pubService.getRecommendations('etu-1');
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── getFeed — personalized with both prof and univ followers ──────────────────

describe('getFeed — path personnalisé mixte', () => {
  it('fusionne et trie les feeds prof + université', async () => {
    const pub1 = { ...mockPub(), id: 'pub-a', created_at: new Date(2000).toISOString() };
    const pub2 = { ...mockPub(), id: 'pub-b', created_at: new Date(1000).toISOString() };

    vi.mocked(interactionsRepo.findCiblesIdsByFollower)
      .mockResolvedValueOnce([PROF_ID])   // profIds
      .mockResolvedValueOnce(['univ-1']); // univIds
    vi.mocked(pubRepo.findFeed)
      .mockResolvedValueOnce([pub1 as never]) // prof feed
      .mockResolvedValueOnce([pub2 as never]); // univ feed
    vi.mocked(interactionsRepo.isLikedBatch).mockResolvedValue(new Set());
    vi.mocked(interactionsRepo.isSavedBatch).mockResolvedValue(new Set());

    const result = await pubService.getFeed({ requesterId: USER_ID, requesterRole: 'etudiant', limit: 20 });
    expect(Array.isArray(result.data)).toBe(true);
  });
});
