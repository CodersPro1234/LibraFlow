import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

// ── Magic bytes (validation post-multer sur req.file.buffer) ─────────────────

const MAGIC_BYTES = {
  pdf:  [[0x25, 0x50, 0x44, 0x46]],                           // %PDF
  doc:  [[0xD0, 0xCF, 0x11, 0xE0]],                           // OLE2
  docx: [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06]], // ZIP/OOXML
  jpg:  [[0xFF, 0xD8, 0xFF]],
  png:  [[0x89, 0x50, 0x4E, 0x47]],
  webp: [[0x52, 0x49, 0x46, 0x46]],
};

function matchesMagic(buffer: Buffer, signatures: number[][]): boolean {
  return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
}

/** Middleware post-multer : rejette les documents dont les magic bytes ne correspondent pas */
export function validateDocumentBytes(req: Request, _res: Response, next: NextFunction): void {
  if (!req.file) { next(); return; }
  const buf = req.file.buffer;
  const valid =
    matchesMagic(buf, MAGIC_BYTES.pdf) ||
    matchesMagic(buf, MAGIC_BYTES.doc) ||
    matchesMagic(buf, MAGIC_BYTES.docx);
  if (!valid) {
    next(new ValidationError('Fichier invalide : le contenu ne correspond pas à un PDF ou Word.'));
    return;
  }
  next();
}

/** Middleware post-multer : rejette les images dont les magic bytes ne correspondent pas */
export function validateImageBytes(req: Request, _res: Response, next: NextFunction): void {
  if (!req.file) { next(); return; }
  const buf = req.file.buffer;
  const valid =
    matchesMagic(buf, MAGIC_BYTES.jpg) ||
    matchesMagic(buf, MAGIC_BYTES.png) ||
    matchesMagic(buf, MAGIC_BYTES.webp);
  if (!valid) {
    next(new ValidationError('Fichier invalide : le contenu ne correspond pas à une image JPEG, PNG ou WebP.'));
    return;
  }
  next();
}

// ── Multer config ─────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const memoryStorage = multer.memoryStorage();

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Type de fichier non autorisé : ${file.mimetype}. Acceptés : JPEG, PNG, WebP`));
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

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_DOCUMENT_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const documentFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Type de fichier non autorisé : ${file.mimetype}. Acceptés : PDF, DOC, DOCX`));
  }
};

/** Document PDF/Word — champ multipart 'fichier' */
export const uploadDocument = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES },
  fileFilter: documentFileFilter,
}).single('fichier');

/** Convertit les MulterError en ValidationError pour errorHandler */
export function handleMulterError(
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new ValidationError(`Fichier trop volumineux. Maximum autorisé : ${MAX_DOCUMENT_SIZE_BYTES / 1024 / 1024} MB`));
    } else {
      next(new ValidationError(`Erreur upload : ${err.message}`));
    }
    return;
  }
  next(err);
}
