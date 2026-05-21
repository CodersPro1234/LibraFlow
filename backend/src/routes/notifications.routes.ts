import { Router } from 'express';
import * as notifController from '../controllers/notifications.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/** GET /api/v1/notifications */
router.get('/', asyncHandler(notifController.getNotifications));

/** GET /api/v1/notifications/unread/count */
router.get('/unread/count', asyncHandler(notifController.getUnreadCount));

/** PATCH /api/v1/notifications/read-all */
router.patch('/read-all', asyncHandler(notifController.markAllAsRead));

/** PATCH /api/v1/notifications/:id/read */
router.patch('/:id/read', asyncHandler(notifController.markAsRead));

export default router;
