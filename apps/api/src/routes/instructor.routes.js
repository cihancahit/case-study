import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authRequired } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { MatchingService } from "../services/MatchingService.js";
import { assignmentRepo } from "../repositories/assignmentRepo.js";

const router = Router();

router.get("/assignments",
  authRequired,
  requireRole("instructor"),
  asyncHandler(async (req, res) => {
    const list = assignmentRepo.listByInstructorId(req.user.id);
    res.json({ data: list, requestId: req.requestId });
  })
);

router.post("/assignments/:id/accept",
  authRequired,
  requireRole("instructor"),
  asyncHandler(async (req, res) => {
    const result = MatchingService.acceptAssignment({ instructorId: req.user.id, assignmentId: req.params.id });
    res.json({ data: result, requestId: req.requestId });
  })
);

router.post("/assignments/:id/reject",
  authRequired,
  requireRole("instructor"),
  asyncHandler(async (req, res) => {
    const result = MatchingService.rejectAssignment({ instructorId: req.user.id, assignmentId: req.params.id });
    res.json({ data: result, requestId: req.requestId });
  })
);

export default router;
