import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../src/services/auth.service';
import * as authRepo from '../src/repositories/auth.repository';
import * as campusFaso from '../src/services/campusFaso.service';
import bcrypt from 'bcryptjs';
import { AuthError, ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../src/utils/errors';

vi.mock('../src/repositories/auth.repository');
vi.mock('../src/services/campusFaso.service');
vi.mock('bcryptjs');
vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    resize: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('mock-image')),
  })),
}));

const UNIV_ID = 'univ-111';

beforeEach(() => { vi.clearAllMocks(); });

// ── login ─────────────────────────────────────────────────────────────────────

describe('login', () => {
  it('throws AuthError si utilisateur introuvable (email)', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue(null);
    await expect(authService.login({ identifiant: 'test@test.bf', password: 'pass' })).rejects.toThrow(AuthError);
  });

  it('throws AuthError si utilisateur introuvable (INE)', async () => {
    vi.mocked(authRepo.findUserByIne).mockResolvedValue(null);
    await expect(authService.login({ identifiant: 'BF2300001', password: 'pass' })).rejects.toThrow(AuthError);
  });

  it('throws AuthError si mot de passe incorrect', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue({
      id: 'user-1', role: 'etudiant', nom: 'Test', password_hash: '$hash', statut: 'actif', motif_decision: null,
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
    await expect(authService.login({ identifiant: 'test@test.bf', password: 'wrong' })).rejects.toThrow(AuthError);
  });

  it('throws ForbiddenError si compte en_attente', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue({
      id: 'user-1', role: 'etudiant', nom: 'Test', password_hash: '$hash', statut: 'en_attente', motif_decision: null,
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    await expect(authService.login({ identifiant: 'test@test.bf', password: 'pass' })).rejects.toThrow(ForbiddenError);
  });

  it('throws ForbiddenError si compte suspendu', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue({
      id: 'user-1', role: 'etudiant', nom: 'Test', password_hash: '$hash', statut: 'suspendu', motif_decision: 'fraude',
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    await expect(authService.login({ identifiant: 'test@test.bf', password: 'pass' })).rejects.toThrow(ForbiddenError);
  });

  it('throws ForbiddenError si compte rejete', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue({
      id: 'user-1', role: 'etudiant', nom: 'Test', password_hash: '$hash', statut: 'rejete', motif_decision: 'docs manquants',
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    await expect(authService.login({ identifiant: 'test@test.bf', password: 'pass' })).rejects.toThrow(ForbiddenError);
  });

  it('retourne les tokens si connexion réussie', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue({
      id: 'user-1', role: 'etudiant', nom: 'Test User', password_hash: '$hash', statut: 'actif', motif_decision: null,
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(authRepo.saveRefreshToken).mockResolvedValue(undefined);
    const result = await authService.login({ identifiant: 'test@test.bf', password: 'pass' });
    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.user.role).toBe('etudiant');
  });

  it('connecte le ministère sans vérif statut', async () => {
    vi.mocked(authRepo.findUserByEmail).mockResolvedValue({
      id: 'min-1', role: 'ministere', nom: 'Ministère', password_hash: '$hash', statut: 'actif', motif_decision: null,
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(authRepo.saveRefreshToken).mockResolvedValue(undefined);
    const result = await authService.login({ identifiant: 'min@gouv.bf', password: 'pass' });
    expect(result.user.role).toBe('ministere');
  });
});

// ── registerEtudiant ──────────────────────────────────────────────────────────

describe('registerEtudiant', () => {
  it('throws ConflictError si INE déjà utilisé', async () => {
    vi.mocked(authRepo.ineExists).mockResolvedValue(true);
    await expect(authService.registerEtudiant({ numero_ine: 'BF001', password: 'pass', universite_id: UNIV_ID })).rejects.toThrow(ConflictError);
  });

  it('throws ValidationError si INE invalide selon Campus Faso', async () => {
    vi.mocked(authRepo.ineExists).mockResolvedValue(false);
    vi.mocked(campusFaso.verifyIne).mockResolvedValue({ valid: false } as never);
    await expect(authService.registerEtudiant({ numero_ine: 'BAD', password: 'pass', universite_id: UNIV_ID })).rejects.toThrow(ValidationError);
  });

  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(authRepo.ineExists).mockResolvedValue(false);
    vi.mocked(campusFaso.verifyIne).mockResolvedValue({ valid: true, nom_complet: 'Test' } as never);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue(null);
    await expect(authService.registerEtudiant({ numero_ine: 'BF001', password: 'pass', universite_id: UNIV_ID })).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError si université non approuvée', async () => {
    vi.mocked(authRepo.ineExists).mockResolvedValue(false);
    vi.mocked(campusFaso.verifyIne).mockResolvedValue({ valid: true, nom_complet: 'Test' } as never);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue({ id: UNIV_ID, statut: 'en_attente' } as never);
    await expect(authService.registerEtudiant({ numero_ine: 'BF001', password: 'pass', universite_id: UNIV_ID })).rejects.toThrow(ValidationError);
  });

  it('crée l\'étudiant avec succès', async () => {
    vi.mocked(authRepo.ineExists).mockResolvedValue(false);
    vi.mocked(campusFaso.verifyIne).mockResolvedValue({ valid: true, nom_complet: 'Moussa Test' } as never);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue({ id: UNIV_ID, statut: 'approuvee' } as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('$hashed' as never);
    vi.mocked(authRepo.createEtudiant).mockResolvedValue({ id: 'etu-1', nom_complet: 'Moussa Test' } as never);
    vi.mocked(authRepo.saveRefreshToken).mockResolvedValue(undefined);
    const result = await authService.registerEtudiant({ numero_ine: 'BF001', password: 'pass', universite_id: UNIV_ID });
    expect(result).toHaveProperty('access_token');
    expect(result.user.role).toBe('etudiant');
  });
});

// ── registerProfesseur ────────────────────────────────────────────────────────

describe('registerProfesseur', () => {
  it('throws ConflictError si email déjà utilisé', async () => {
    vi.mocked(authRepo.professorEmailExists).mockResolvedValue(true);
    await expect(authService.registerProfesseur({ email_pro: 'prof@test.bf', password: 'pass', nom_complet: 'Dr Test', universite_id: UNIV_ID, matieres: [] })).rejects.toThrow(ConflictError);
  });

  it('throws NotFoundError si université introuvable', async () => {
    vi.mocked(authRepo.professorEmailExists).mockResolvedValue(false);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue(null);
    await expect(authService.registerProfesseur({ email_pro: 'prof@test.bf', password: 'pass', nom_complet: 'Dr Test', universite_id: UNIV_ID, matieres: [] })).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError si université non approuvée', async () => {
    vi.mocked(authRepo.professorEmailExists).mockResolvedValue(false);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue({ id: UNIV_ID, statut: 'en_attente' } as never);
    await expect(authService.registerProfesseur({ email_pro: 'prof@test.bf', password: 'pass', nom_complet: 'Dr Test', universite_id: UNIV_ID, matieres: [] })).rejects.toThrow(ValidationError);
  });

  it('crée le professeur avec succès', async () => {
    vi.mocked(authRepo.professorEmailExists).mockResolvedValue(false);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue({ id: UNIV_ID, statut: 'approuvee' } as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('$hashed' as never);
    vi.mocked(authRepo.createProfesseur).mockResolvedValue({ id: 'prof-1', nom_complet: 'Dr Test' } as never);
    const result = await authService.registerProfesseur({ email_pro: 'prof@test.bf', password: 'pass', nom_complet: 'Dr Test', universite_id: UNIV_ID, matieres: ['Maths'] });
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('message');
  });

  it('crée le professeur avec une photo valide', async () => {
    vi.mocked(authRepo.professorEmailExists).mockResolvedValue(false);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue({ id: UNIV_ID, statut: 'approuvee' } as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('$hashed' as never);
    vi.mocked(authRepo.createProfesseur).mockResolvedValue({ id: 'prof-1', nom_complet: 'Dr Test' } as never);
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const result = await authService.registerProfesseur(
      { email_pro: 'prof2@test.bf', password: 'pass', nom_complet: 'Dr Test', universite_id: UNIV_ID, matieres: ['Maths'] },
      { buffer: jpegBuffer, mimetype: 'image/jpeg', originalname: 'photo.jpg' }
    );
    expect(result).toHaveProperty('id');
  });

  it('throws ValidationError si magic bytes image invalides', async () => {
    vi.mocked(authRepo.professorEmailExists).mockResolvedValue(false);
    vi.mocked(authRepo.findUniversiteById).mockResolvedValue({ id: UNIV_ID, statut: 'approuvee' } as never);
    await expect(
      authService.registerProfesseur(
        { email_pro: 'prof@test.bf', password: 'pass', nom_complet: 'Dr Test', universite_id: UNIV_ID, matieres: [] },
        { buffer: Buffer.from('not an image at all!!!'), mimetype: 'image/jpeg', originalname: 'fake.jpg' }
      )
    ).rejects.toThrow(ValidationError);
  });
});

// ── registerUniversite ────────────────────────────────────────────────────────

describe('registerUniversite', () => {
  it('crée une université avec succès', async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue('$hashed' as never);
    vi.mocked(authRepo.createUniversite).mockResolvedValue({ id: 'univ-new' } as never);
    const result = await authService.registerUniversite(
      {
        nom_officiel: 'Université Test',
        adresse: '123 rue Test',
        email: 'univ@test.bf',
        password: 'TestPass123!',
        nom_administrateur: 'Admin Test',
        numero_agrement: 'AGR001',
        region: 'Centre',
        latitude: 12.3,
        longitude: -1.5,
      },
      { buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]), mimetype: 'image/jpeg', originalname: 'logo.jpg' }
    );
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('message');
  });
});

// ── refreshAccessToken ────────────────────────────────────────────────────────

describe('refreshAccessToken', () => {
  it('throws AuthError si token invalide', async () => {
    vi.mocked(authRepo.findActiveRefreshToken).mockResolvedValue(null);
    await expect(authService.refreshAccessToken('invalid-token')).rejects.toThrow(AuthError);
  });

  it('throws AuthError si utilisateur introuvable', async () => {
    vi.mocked(authRepo.findActiveRefreshToken).mockResolvedValue({ user_id: 'u-1', user_role: 'etudiant' } as never);
    vi.mocked(authRepo.findUserById).mockResolvedValue(null);
    await expect(authService.refreshAccessToken('valid-token')).rejects.toThrow(AuthError);
  });

  it('retourne un nouvel access token', async () => {
    vi.mocked(authRepo.findActiveRefreshToken).mockResolvedValue({ user_id: 'u-1', user_role: 'etudiant' } as never);
    vi.mocked(authRepo.findUserById).mockResolvedValue({ id: 'u-1', nom: 'Test', statut: 'actif', motif_decision: null } as never);
    const result = await authService.refreshAccessToken('valid-token');
    expect(result).toHaveProperty('access_token');
    expect(result.expires_in).toBe(900);
  });
});

// ── logout ────────────────────────────────────────────────────────────────────

describe('logout', () => {
  it('révoque le refresh token sans erreur', async () => {
    vi.mocked(authRepo.revokeRefreshToken).mockResolvedValue(undefined);
    await expect(authService.logout('some-token')).resolves.toBeUndefined();
  });
});

// ── verifyIne ────────────────────────────────────────────────────────────────

describe('verifyIne', () => {
  it('délègue à campusFaso.verifyIne', async () => {
    vi.mocked(campusFaso.verifyIne).mockResolvedValue({ valid: true, nom_complet: 'Test' } as never);
    const result = await authService.verifyIne('BF001');
    expect(result.valid).toBe(true);
  });
});
