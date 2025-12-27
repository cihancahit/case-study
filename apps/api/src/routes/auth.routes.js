import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { AuthService } from '../services/AuthService.js';

const router = Router();

const loginSchema = z.object({
  userId: z.string().min(1),
});

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const result = AuthService.login({ userId: body.userId });
    res.json({ data: result, requestId: req.requestId });
  })
);

export default router;
