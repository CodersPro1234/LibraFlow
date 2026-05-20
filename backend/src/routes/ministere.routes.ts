import { Router } from 'express';
import * as minController from '../controllers/ministere.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/roles.middleware';
import { approuverSchema, motifSchema } from '../validators/ministere.validators';

const router = Router();

// Toutes les routes ministère nécessitent d'être authentifié en tant que ministère
router.use(authenticate, requireRole('ministere'));

/** PATCH /api/v1/ministere/universites/:id/approuver */
router.patch(
  '/universites/:id/approuver',
  validate(approuverSchema),
  asyncHandler(minController.approuverUniversite)
);

/** PATCH /api/v1/ministere/universites/:id/rejeter */
router.patch(
  '/universites/:id/rejeter',
  validate(motifSchema),
  asyncHandler(minController.rejeterUniversite)
);

/** PATCH /api/v1/ministere/universites/:id/suspendre */
router.patch(
  '/universites/:id/suspendre',
  validate(motifSchema),
  asyncHandler(minController.suspendreUniversite)
);

/** PATCH /api/v1/ministere/universites/:id/reactiver */
router.patch(
  '/universites/:id/reactiver',
  asyncHandler(minController.reactiverUniversite)
);

export default router;
