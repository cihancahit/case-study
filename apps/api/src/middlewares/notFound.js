import { E } from "../utils/appError.js";

export function notFoundRoute(req, res, next) {
    next(E.notFound("NOT_FOUND", `Cannot ${req.method} ${req.originalUrl}`));
}