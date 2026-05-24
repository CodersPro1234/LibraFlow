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

/** GET /api/v1/me/publications/stats — professeur uniquement */
router.get('/publications/stats', asyncHandler(meController.getMesPublicationsStats));

/** GET /api/v1/me/history — étudiant */
router.get('/history', asyncHandler(meController.getHistorique));

/** POST /api/v1/me/history — étudiant */
router.post('/history', asyncHandler(meController.addHistorique));

/** GET /api/v1/me/downloads — étudiant */
router.get('/downloads', asyncHandler(meController.getDownloads));

/** GET /api/v1/me/abonnes — professeur */
router.get('/abonnes', asyncHandler(meController.getAbonnes));

/** GET /api/v1/me/interactions-recentes — professeur */
router.get('/interactions-recentes', asyncHandler(meController.getInteractionsRecentes));

export default router;
