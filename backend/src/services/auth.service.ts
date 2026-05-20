import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash, randomUUID } from 'crypto';
import sharp from 'sharp';
import { env } from '../config/env';
import { supabaseAdmin } from '../config/supabase';
import * as authRepo from '../repositories/auth.repository';
import * as campusFaso from './campusFaso.service';
import {
  AppError,
  AuthError,
  ForbiddenError,
  ConflictError,
  ValidationError,
  NotFoundError,
} from '../utils/errors';
import logger from '../utils/logger';
import type { Role, AuthUser, JwtPayload } from '../types';
import type {
  RegisterEtudiantInput,
  RegisterProfesseurInput,
  RegisterUniversiteInput,
  LoginInput,
} from '../validators/auth.validators';
import type { IneVerificationResult } from './campusFaso.service';

// ── Types publics ─────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; role: Role; nom: string };
}

export interface ImageFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

// ── Helpers JWT & tokens ──────────────────────────────────────────────────────

function generateAccessToken(user: AuthUser): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    role: user.role,
    nom: user.nom,
  };
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: '15m' });
}

function generateRefreshToken(): string {
  return randomBytes(64).toString('hex');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function issueTokenPair(user: AuthUser): Promise<AuthResponse> {
  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await authRepo.saveRefreshToken({
    user_id: user.id,
    user_role: user.role,
    token_hash: hashToken(refresh_token),
    expires_at: expiresAt,
  });

  return {
    access_token,
    refresh_token,
    expires_in: 900,
    user: { id: user.id, role: user.role, nom: user.nom },
  };
}

// ── Helpers image ────────────────────────────────────────────────────────────

function validateImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // WebP: RIFF????WEBP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) return true;
  return false;
}

async function processAndUploadImage(
  file: ImageFile,
  bucket: string,
  folder: string
): Promise<string> {
  if (!validateImageMagicBytes(file.buffer)) {
    throw new ValidationError('Fichier image invalide (magic bytes incorrects)');
  }

  const processed = await sharp(file.buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const filePath = `${folder}/${randomUUID()}.jpg`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, processed, { contentType: 'image/jpeg', upsert: false });

  if (error) {
    throw new AppError(`Échec de l'upload : ${error.message}`, 500, 'UPLOAD_ERROR', undefined, false);
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// ── Statut compte ─────────────────────────────────────────────────────────────

function assertAccountActive(role: Role, statut: string | undefined, motif: string | null | undefined): void {
  if (role === 'ministere') return;

  if (statut === 'en_attente') {
    throw new ForbiddenError('Votre compte est en attente de validation', 'ACCOUNT_PENDING', { motif: null });
  }
  if (statut === 'rejete') {
    throw new ForbiddenError('Votre compte a été rejeté', 'ACCOUNT_REJECTED', { motif: motif ?? null });
  }
  if (statut === 'suspendu' || statut === 'suspendue') {
    throw new ForbiddenError('Votre compte est suspendu', 'ACCOUNT_SUSPENDED', { motif: motif ?? null });
  }
}

// ── Service public ────────────────────────────────────────────────────────────

/** Proxy vers Campus Faso avec circuit breaker */
export async function verifyIne(ine: string): Promise<IneVerificationResult> {
  return campusFaso.verifyIne(ine);
}

/** Inscription étudiant : vérifie INE, crée le compte, retourne les tokens */
export async function registerEtudiant(input: RegisterEtudiantInput): Promise<AuthResponse> {
  if (await authRepo.ineExists(input.numero_ine)) {
    throw new ConflictError('Ce numéro INE est déjà associé à un compte');
  }

  const ineResult = await campusFaso.verifyIne(input.numero_ine);
  if (!ineResult.valid) {
    throw new ValidationError("Numéro INE invalide ou non reconnu par Campus Faso");
  }

  const universite = await authRepo.findUniversiteById(input.universite_id);
  if (!universite) throw new NotFoundError('Université');
  if (universite.statut !== 'approuvee') {
    throw new ValidationError("Cette université n'est pas encore approuvée par le Ministère");
  }

  const password_hash = await bcrypt.hash(input.password, 12);

  const etudiant = await authRepo.createEtudiant({
    universite_id: input.universite_id,
    numero_ine: input.numero_ine,
    nom_complet: ineResult.nom_complet ?? input.numero_ine,
    password_hash,
  });

  logger.info({ etudiantId: etudiant.id, ine: input.numero_ine }, 'Nouvel étudiant inscrit');

  return issueTokenPair({ id: etudiant.id, role: 'etudiant', nom: etudiant.nom_complet });
}

/** Inscription professeur — compte créé en statut 'en_attente' */
export async function registerProfesseur(
  input: RegisterProfesseurInput,
  photoFile?: ImageFile
): Promise<{ message: string; id: string }> {
  if (await authRepo.professorEmailExists(input.email_pro)) {
    throw new ConflictError('Cet email professionnel est déjà utilisé');
  }

  const universite = await authRepo.findUniversiteById(input.universite_id);
  if (!universite) throw new NotFoundError('Université');
  if (universite.statut !== 'approuvee') {
    throw new ValidationError("Cette université n'est pas encore approuvée par le Ministère");
  }

  const password_hash = await bcrypt.hash(input.password, 12);

  let photo_url: string | null = null;
  if (photoFile) {
    photo_url = await processAndUploadImage(photoFile, 'professeurs-photos', 'photos');
  }

  const professeur = await authRepo.createProfesseur({
    universite_id: input.universite_id,
    nom_complet: input.nom_complet,
    email_pro: input.email_pro,
    password_hash,
    matieres: input.matieres,
    photo_url,
  });

  logger.info({ professeurId: professeur.id, email: input.email_pro }, 'Nouveau professeur inscrit (en attente)');

  return {
    message: 'Votre compte est en attente de validation par votre université.',
    id: professeur.id,
  };
}

/** Inscription université — compte créé en statut 'en_attente' */
export async function registerUniversite(
  input: RegisterUniversiteInput,
  logoFile: ImageFile
): Promise<{ message: string; id: string }> {
  const logo_url = await processAndUploadImage(logoFile, 'universites-logos', 'logos');

  const password_hash = await bcrypt.hash(input.password, 12);

  const universite = await authRepo.createUniversite({
    nom_officiel: input.nom_officiel,
    adresse: input.adresse,
    email: input.email,
    password_hash,
    nom_administrateur: input.nom_administrateur,
    logo_url,
    numero_agrement: input.numero_agrement,
    region: input.region,
    latitude: input.latitude,
    longitude: input.longitude,
  });

  logger.info({ universiteId: universite.id, email: input.email }, 'Nouvelle université inscrite (en attente)');

  return {
    message: "Votre dossier a été transmis au Ministère de l'Éducation pour approbation.",
    id: universite.id,
  };
}

/** Connexion unifiée : INE → étudiant, email → autres rôles */
export async function login(input: LoginInput): Promise<AuthResponse> {
  const isEmail = input.identifiant.includes('@');
  const user = isEmail
    ? await authRepo.findUserByEmail(input.identifiant)
    : await authRepo.findUserByIne(input.identifiant);

  if (!user) {
    throw new AuthError('Identifiant ou mot de passe incorrect');
  }

  const passwordValid = await bcrypt.compare(input.password, user.password_hash);
  if (!passwordValid) {
    throw new AuthError('Identifiant ou mot de passe incorrect');
  }

  assertAccountActive(user.role, user.statut, user.motif_decision);

  logger.info({ userId: user.id, role: user.role }, 'Connexion réussie');

  return issueTokenPair({ id: user.id, role: user.role, nom: user.nom });
}

/** Rafraîchit l'access token via un refresh token valide */
export async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const tokenHash = hashToken(refreshToken);
  const stored = await authRepo.findActiveRefreshToken(tokenHash);

  if (!stored) {
    throw new AuthError('Refresh token invalide ou révoqué', 'INVALID_REFRESH_TOKEN');
  }

  const role = stored.user_role as Role;
  const userInfo = await authRepo.findUserById(stored.user_id, role);
  if (!userInfo) {
    throw new AuthError('Utilisateur introuvable');
  }

  assertAccountActive(role, userInfo.statut, undefined);

  const access_token = generateAccessToken({ id: stored.user_id, role, nom: userInfo.nom });
  return { access_token, expires_in: 900 };
}

/** Révoque un refresh token (logout) */
export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await authRepo.revokeRefreshToken(tokenHash);
  logger.info({ tokenHash: tokenHash.slice(0, 8) }, 'Refresh token révoqué');
}
