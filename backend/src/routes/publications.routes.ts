import { Router } from 'express';
import * as pubController from '../controllers/publications.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadDocument, handleMulterError, validateDocumentBytes } from '../middlewares/upload.middleware';
import { askLimiter } from '../middlewares/rateLimiter.middleware';
import {
  createPublicationSchema,
  updatePublicationSchema,
  searchPublicationsSchema,
  signalerSchema,
  askSchema,
} from '../validators/publications.validators';

const router = Router();

/** GET /api/v1/publications/search — authentifié */
router.get('/search', authenticate, validate(searchPublicationsSchema, 'query'), asyncHandler(pubController.searchPublications));

/** POST /api/v1/publications — professeur uniquement */
router.post('/',
  authenticate,
  uploadDocument,
  handleMulterError,
  validateDocumentBytes,
  validate(createPublicationSchema),
  asyncHandler(pubController.createPublication)
);

/** GET /api/v1/publications/:id */
router.get('/:id', authenticate, asyncHandler(pubController.getPublication));

/** PATCH /api/v1/publications/:id */
router.patch('/:id', authenticate, validate(updatePublicationSchema), asyncHandler(pubController.updatePublication));

/** DELETE /api/v1/publications/:id */
router.delete('/:id', authenticate, asyncHandler(pubController.deletePublication));

/** GET /api/v1/publications/:id/download */
router.get('/:id/download', authenticate, asyncHandler(pubController.getDownloadUrl));

/** POST /api/v1/publications/:id/tts */
router.post('/:id/tts', authenticate, asyncHandler(pubController.requestTts));

/** POST /api/v1/publications/:id/ask */
router.post('/:id/ask', authenticate, askLimiter, validate(askSchema), asyncHandler(pubController.askQuestion));

/** POST /api/v1/publications/:id/signaler */
router.post('/:id/signaler', authenticate, validate(signalerSchema), asyncHandler(pubController.signalerPublication));

/** POST /api/v1/publications/:id/share */
router.post('/:id/share', authenticate, asyncHandler(pubController.createShareLink));

export default router;
