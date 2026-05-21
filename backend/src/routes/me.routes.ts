import { Router } from 'express';
import * as meController from '../controllers/me.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadPhoto, handleMulterError } from '../middlewares/upload.middleware';
import { changePasswordSchema } from '../validators/me.validators';

const router = Router();

// Toutes les routes /me requièrent authentification
router.use(authenticate);

/** GET /api/v1/me */
router.get('/', asyncHandler(meController.getProfile));

/** PATCH /api/v1/me */
router.patch('/', uploadPhoto, handleMulterError, asyncHandler(meController.updateProfile));

/** POST /api/v1/me/password */
router.post('/password', validate(changePasswordSchema), asyncHandler(meController.changePassword));

/** GET /api/v1/me/publications — professeur uniquement */
router.get('/publications', asyncHandler(meController.getMesPublications));

/** GET /api/v1/me/community — professeur uniquement */
router.get('/community', asyncHandler(meController.getMaCommunaute));

/** GET /api/v1/me/recommendations — étudiant */
router.get('/recommendations', asyncHandler(meController.getRecommendations));

/** GET /api/v1/me/library — étudiant */
router.get('/library', asyncHandler(meController.getBibliotheque));

export default router;
