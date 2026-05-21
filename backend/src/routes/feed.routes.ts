import { Router } from 'express';
import * as pubController from '../controllers/publications.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { feedQuerySchema } from '../validators/publications.validators';

const router = Router();

/** GET /api/v1/feed */
router.get('/', authenticate, validate(feedQuerySchema, 'query'), asyncHandler(pubController.getFeed));

export default router;
