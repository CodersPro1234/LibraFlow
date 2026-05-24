import type { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { NotFoundError, ValidationError } from '../utils/errors';
import type {
  RegisterEtudiantInput,
  RegisterProfesseurInput,
  RegisterUniversiteInput,
  LoginInput,
} from '../validators/auth.validators';
import type { ImageFile } from '../services/auth.service';

function extractImageFile(file: Express.Multer.File | undefined): ImageFile | undefined {
  if (!file) return undefined;
  return { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname };
}

/** GET /api/v1/auth/verify-ine/:ine */
export async function verifyIne(req: Request, res: Response): Promise<void> {
  const { ine } = req.params as { ine: string };
  const result = await authService.verifyIne(ine);

  if (!result.valid) {
    throw new NotFoundError('Numéro INE');
  }

  res.json({ valid: true, nom_complet: result.nom_complet });
}

/** POST /api/v1/auth/register/etudiant */
export async function registerEtudiant(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterEtudiantInput;
  const response = await authService.registerEtudiant(input);
  res.status(201).json(response);
}

/** POST /api/v1/auth/register/professeur */
export async function registerProfesseur(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterProfesseurInput;
  const photoFile = extractImageFile(req.file);
  const response = await authService.registerProfesseur(input, photoFile);
  res.status(201).json(response);
}

/** POST /api/v1/auth/register/universite */
export async function registerUniversite(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterUniversiteInput;

  if (!req.file) {
    throw new ValidationError("Le logo est requis pour l'inscription d'une université");
  }

  const logoFile = extractImageFile(req.file)!;
  const response = await authService.registerUniversite(input, logoFile);
  res.status(201).json(response);
}

/** POST /api/v1/auth/login */
export async function login(req: Request, res: Response): Promise<void> {
  const input = req.body as LoginInput;
  const response = await authService.login(input);
  res.json(response);
}

/** POST /api/v1/auth/refresh */
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refresh_token } = req.body as { refresh_token: string };
  const response = await authService.refreshAccessToken(refresh_token);
  res.json(response);
}

/** POST /api/v1/auth/logout */
export async function logout(req: Request, res: Response): Promise<void> {
  const { refresh_token } = req.body as { refresh_token: string };
  await authService.logout(refresh_token);
  res.status(204).send();
}
