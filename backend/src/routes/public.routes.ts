import { Router } from 'express';
import * as publicController from '../controllers/public.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/** GET /api/v1/public/universites */
router.get('/universites', asyncHandler(publicController.getUniversitesPubliques));

/** GET /api/v1/public/universites/:id */
router.get('/universites/:id', asyncHandler(publicController.getUniversitePublique));

/** GET /api/v1/public/professeurs/:id */
router.get('/professeurs/:id', asyncHandler(publicController.getProfesseurPublic));

/** GET /api/v1/public/share/:token — lien de partage public */
router.get('/share/:token', asyncHandler(publicController.getSharedPublication));

export default router;
