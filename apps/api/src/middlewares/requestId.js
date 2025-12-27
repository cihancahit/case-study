import { nanoid } from "nanoid";

export function requestId(req, res, next) {
    req.requestId = nanoid();
    res.setHeader("X-Request-Id", req.requestId);
    next();
}