import { Router } from 'express';
import * as univController from '../controllers/universite.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/roles.middleware';
import { motifSchema } from '../validators/universite.validators';

const router = Router();

// Toutes les routes université nécessitent d'être authentifié en tant qu'université
router.use(authenticate, requireRole('universite'));

/** PATCH /api/v1/universite/professeurs/:id/valider */
router.patch(
  '/professeurs/:id/valider',
  asyncHandler(univController.validerProfesseur)
);

/** PATCH /api/v1/universite/professeurs/:id/rejeter */
router.patch(
  '/professeurs/:id/rejeter',
  validate(motifSchema),
  asyncHandler(univController.rejeterProfesseur)
);

/** PATCH /api/v1/universite/professeurs/:id/suspendre */
router.patch(
  '/professeurs/:id/suspendre',
  validate(motifSchema),
  asyncHandler(univController.suspendreProfesseur)
);

/** GET /api/v1/universite/dashboard */
router.get('/dashboard', asyncHandler(univController.getDashboard));

/** GET /api/v1/universite/professeurs */
router.get('/professeurs', asyncHandler(univController.listProfesseurs));

/** GET /api/v1/universite/etudiants */
router.get('/etudiants', asyncHandler(univController.listEtudiants));

/** PATCH /api/v1/universite/etudiants/:id/suspendre */
router.patch('/etudiants/:id/suspendre', validate(motifSchema), asyncHandler(univController.suspendreEtudiant));

/** GET /api/v1/universite/publications */
router.get('/publications', asyncHandler(univController.listPublications));

/** GET /api/v1/universite/publications/:id */
router.get('/publications/:id', asyncHandler(univController.getPublication));

/** PATCH /api/v1/universite/etudiants/:id/reactiver */
router.patch('/etudiants/:id/reactiver', asyncHandler(univController.reactiverEtudiant));

/** DELETE /api/v1/universite/publications/:id/supprimer */
router.delete('/publications/:id/supprimer', asyncHandler(univController.supprimerPublication));

/** GET /api/v1/universite/top */
router.get('/top', asyncHandler(univController.getTopPublications));

/** GET /api/v1/universite/evolution-mensuelle */
router.get('/evolution-mensuelle', asyncHandler(univController.getEvolutionMensuelle));

export default router;
