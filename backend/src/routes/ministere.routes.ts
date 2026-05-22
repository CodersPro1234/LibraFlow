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

/** GET /api/v1/ministere/dashboard */
router.get('/dashboard', asyncHandler(minController.getDashboard));

/** GET /api/v1/ministere/universites */
router.get('/universites', asyncHandler(minController.listUniversites));

/** GET /api/v1/ministere/universites/:id/dossier */
router.get('/universites/:id/dossier', asyncHandler(minController.getUniversiteDossier));

/** GET /api/v1/ministere/statistiques */
router.get('/statistiques', asyncHandler(minController.getStatistiques));

/** GET /api/v1/ministere/carte */
router.get('/carte', asyncHandler(minController.getCarte));

/** GET /api/v1/ministere/statistiques-nationales/region — doit être avant /:id */
router.get('/statistiques-nationales/region', asyncHandler(minController.getStatistiquesParRegion));

/** GET /api/v1/ministere/statistiques-nationales */
router.get('/statistiques-nationales', asyncHandler(minController.getStatistiquesNationales));

/** GET /api/v1/ministere/signalements */
router.get('/signalements', asyncHandler(minController.listSignalements));

/** DELETE /api/v1/ministere/signalements/:id/supprimer */
router.delete('/signalements/:id/supprimer', asyncHandler(minController.supprimerSignalement));

/** POST /api/v1/ministere/signalements/:id/innocenter */
router.post('/signalements/:id/innocenter', asyncHandler(minController.innocenterSignalement));

/** POST /api/v1/ministere/signalements/:id/avertir */
router.post('/signalements/:id/avertir', asyncHandler(minController.avertirSignalement));

export default router;
