import { Router } from 'express';
import * as interactionsController from '../controllers/interactions.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { postCommentaireSchema } from '../validators/interactions.validators';

const router = Router();

// Toutes les interactions requièrent d'être authentifié
router.use(authenticate);

/** POST /api/v1/publications/:id/like */
router.post('/publications/:id/like', asyncHandler(interactionsController.likePublication));

/** DELETE /api/v1/publications/:id/like */
router.delete('/publications/:id/like', asyncHandler(interactionsController.unlikePublication));

/** GET /api/v1/publications/:id/comments */
router.get('/publications/:id/comments', asyncHandler(interactionsController.getCommentaires));

/** POST /api/v1/publications/:id/comments */
router.post('/publications/:id/comments', validate(postCommentaireSchema), asyncHandler(interactionsController.postCommentaire));

/** DELETE /api/v1/comments/:id */
router.delete('/comments/:id', asyncHandler(interactionsController.deleteCommentaire));

/** POST /api/v1/publications/:id/save */
router.post('/publications/:id/save', asyncHandler(interactionsController.savePublication));

/** DELETE /api/v1/publications/:id/save */
router.delete('/publications/:id/save', asyncHandler(interactionsController.unsavePublication));

/** POST /api/v1/follow/professeur/:id */
router.post('/follow/professeur/:id', asyncHandler(interactionsController.followProfesseur));

/** DELETE /api/v1/follow/professeur/:id */
router.delete('/follow/professeur/:id', asyncHandler(interactionsController.unfollowProfesseur));

/** POST /api/v1/follow/universite/:id */
router.post('/follow/universite/:id', asyncHandler(interactionsController.followUniversite));

/** DELETE /api/v1/follow/universite/:id */
router.delete('/follow/universite/:id', asyncHandler(interactionsController.unfollowUniversite));

export default router;
