import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const memoryStorage = multer.memoryStorage();

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Type de fichier non autorisé : ${file.mimetype}. Acceptés : JPEG, PNG, WebP`
      )
    );
  }
};

/** Photo de profil professeur — champ multipart 'photo' (optionnel) */
export const uploadPhoto = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: imageFileFilter,
}).single('photo');

/** Logo université — champ multipart 'logo' (requis côté service) */
export const uploadLogo = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: imageFileFilter,
}).single('logo');

/** Convertit les MulterError en ValidationError pour errorHandler */
export function handleMulterError(
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new ValidationError(`Fichier trop volumineux. Maximum : ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024} MB`));
    } else {
      next(new ValidationError(`Erreur upload : ${err.message}`));
    }
    return;
  }
  next(err);
}
