import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authRequired } from '../middlewares/auth.js';
import { lessonRepo } from '../repositories/lessonRepo.js';
import { MatchingService } from '../services/MatchingService.js';
import { nanoid } from 'nanoid';
import { E } from '../utils/appError.js';

const router = Router();

const createRequestSchema = z.object({
  note: z.string().min(1),
  courseId: z.string().min(1).optional(),
});

router.post(
  '/',
  authRequired,
  asyncHandler(async (req, res) => {
    const body = createRequestSchema.parse(req.body);

    const now = new Date().toISOString();
    const reqObj = lessonRepo.createRequest({
      id: nanoid(),
      userId: req.user.id,
      courseId: body.courseId || null,
      note: body.note,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    });
    let matchResult = null;
    try {
        matchResult = MatchingService.matchRequest({
          requestId: reqObj.id,
          requesterUserId: "SYSTEM_AUTO_MATCH",
        });
    } catch (error) {
        // Auto-matching failed, proceed without matching
        matchResult = null;
    }

    res.json({ data: { request: reqObj, match: matchResult }, requestId: req.requestId });
  })
);

router.get(
  '/mine',
  authRequired,
  asyncHandler(async (req, res) => {
    const list = lessonRepo.listByUserId(req.user.id);
    res.json({ data: list, requestId: req.requestId });
  })
);

router.post(
  '/:id/match',
  authRequired,
  asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    if (!requestId) throw E.badRequest('REQUEST_ID_REQUIRED', 'Request id is required');

    const result = MatchingService.matchRequest({
      requestId,
      requesterUserId: req.user.id,
    });

    res.json({ data: result, requestId: req.requestId });
  })
);

export default router;
