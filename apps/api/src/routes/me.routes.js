import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authRequired } from '../middlewares/auth.js';
import { entitlementRepo } from '../repositories/entitlementRepo.js';
import { courseRepo } from '../repositories/courseRepo.js';
import { notificationRepo } from '../repositories/notificationRepo.js';

const router = Router();

router.get(
  '/purchases',
  authRequired,
  asyncHandler(async (req, res) => {
    const ents = entitlementRepo.listByUserId(req.user.id);

    const result = ents.map((e) => {
      const c = courseRepo.findById(e.courseId);
      return {
        entitlement: e,
        course: c
          ? {
              id: c.id,
              title: c.title,
              description: c.description,
              instructorId: c.instructorId,
              price: c.price,
            }
          : null,
      };
    });

    res.json({ data: result, requestId: req.requestId });
  })
);

router.get(
  '/notifications',
  authRequired,
  asyncHandler(async (req, res) => {
    const list = notificationRepo.listByToAccountId(req.user.id);
    res.json({ data: list, requestId: req.requestId });
  })
);

export default router;
