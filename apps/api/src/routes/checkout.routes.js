import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authRequired } from "../middlewares/auth.js";
import { CheckoutService } from "../services/CheckoutService.js";

const router = Router();

const createSchema = z.object({
  courseId: z.string().min(1),
  idempotencyKey: z.string().min(6),
});

router.post("/create",
  authRequired,
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const userId = req.user.id;

    const result = await CheckoutService.createCheckout({
      userId,
      courseId: body.courseId,
      idempotencyKey: body.idempotencyKey,
    });

    res.json({ data: result, requestId: req.requestId });
  })
);

const confirmSimSchema = z.object({
  checkoutId: z.string().min(1),
  result: z.enum(["success", "fail"]),
});

router.post("/confirm-simulated",
  authRequired,
  asyncHandler(async (req, res) => {
    const body = confirmSimSchema.parse(req.body);
    const userId = req.user.id;

    const result = CheckoutService.confirmSimulated({
      userId,
      checkoutId: body.checkoutId,
      result: body.result,
    });

    res.json({ data: result, requestId: req.requestId });
  })
);

router.get("/stripe-success",
  authRequired,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const checkoutId = String(req.query.checkoutId || "");
    const sessionId = String(req.query.session_id || "");
    const result = await CheckoutService.confirmStripeSuccess({ userId, checkoutId, sessionId });
    res.json({ data: result, requestId: req.requestId });
  })
);

export default router;
