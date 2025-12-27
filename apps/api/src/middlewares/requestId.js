import { nanoid } from "zod";

export function requestId(req, res, next) {
    req.requestId = nanoid();
    res.setHeader("X-Request-Id", req.requestId);
    next();
}