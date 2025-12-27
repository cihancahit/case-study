import { E } from "../utils/appError.js";

export function notFound(req, res, next) {
    next(E.notFound("NOT_FOUND", `Cannot ${req.method} ${req.originalUrl}`));
}