import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { courseRepo } from '../repositories/courseRepo.js';
import { E } from '../utils/appError.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json({ data: courseRepo.list(), requestId: req.requestId });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const c = courseRepo.findById(req.params.id);
    if (!c) throw E.notFound('COURSE_NOT_FOUND', 'Course not found');
    res.json({ data: c, requestId: req.requestId });
  })
);

export default router;
