import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authRequired } from '../middlewares/auth.js';
import { notificationRepo } from '../repositories/notificationRepo.js';
import { E } from '../utils/appError.js';

const router = Router();

router.get(
  '/mine',
  authRequired,
  asyncHandler(async (req, res) => {
    const list = notificationRepo.listByToAccountId(req.user.id);
    res.json({ data: list, requestId: req.requestId });
  })
);

router.post(
  '/:id/read',
  authRequired,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const n = notificationRepo.findById(id);
    if (!n) throw E.notFound('NOTIFICATION_NOT_FOUND', 'Notification not found');

    if (n.toAccountId !== req.user.id) {
      throw E.forbidden('NOTIFICATION_FORBIDDEN', 'You cannot read this notification');
    }

    const updated = notificationRepo.markRead(id, new Date().toISOString());
    res.json({ data: updated, requestId: req.requestId });
  })
);

export default router;
