import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { uploadPhoto, uploadLogo, handleMulterError } from '../middlewares/upload.middleware';
import {
  verifyIneParamsSchema,
  registerEtudiantSchema,
  registerProfesseurSchema,
  registerUniversiteSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validators/auth.validators';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/** GET /api/v1/auth/verify-ine/:ine — public */
router.get(
  '/verify-ine/:ine',
  validate(verifyIneParamsSchema, 'params'),
  asyncHandler(authController.verifyIne)
);

/** POST /api/v1/auth/register/etudiant — public */
router.post(
  '/register/etudiant',
  validate(registerEtudiantSchema),
  asyncHandler(authController.registerEtudiant)
);

/** POST /api/v1/auth/register/professeur — public, multipart */
router.post(
  '/register/professeur',
  uploadPhoto,
  handleMulterError,
  validate(registerProfesseurSchema),
  asyncHandler(authController.registerProfesseur)
);

/** POST /api/v1/auth/register/universite — public, multipart */
router.post(
  '/register/universite',
  uploadLogo,
  handleMulterError,
  validate(registerUniversiteSchema),
  asyncHandler(authController.registerUniversite)
);

/** POST /api/v1/auth/login — public */
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login)
);

/** POST /api/v1/auth/refresh — public */
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken)
);

/** POST /api/v1/auth/logout — authentifié */
router.post(
  '/logout',
  authenticate,
  validate(logoutSchema),
  asyncHandler(authController.logout)
);

export default router;
