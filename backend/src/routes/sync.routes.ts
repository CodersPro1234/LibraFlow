import { Router } from 'express';
import * as syncController from '../controllers/sync.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/** POST /api/v1/sync/pending-actions */
router.post('/pending-actions', asyncHandler(syncController.syncPendingActions));

/** GET /api/v1/sync/offline-feed-pack (alias: /offline/feed-pack monté séparément) */
router.get('/offline-feed-pack', asyncHandler(syncController.getOfflineFeedPack));

export default router;
