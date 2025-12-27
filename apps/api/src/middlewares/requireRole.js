import {E} from "../utils/appError.js";

export const requireRole = (role) => (req, res, next) => {
    if (!req.user) return next(E.unauthorized("UNAUTHORIZED", "Login required"));
    if (req.user.role !== role) return next(E.forbidden("ROLE_FORBIDDEN", `Requires role: ${role}`));
    next();
}

export const requireAnyRole = (roles) => (req, res, next) => {
    if (!req.user) return next(E.unauthorized("UNAUTHORIZED", "Login required"));
    if (!roles.includes(req.user.role)) return next(E.forbidden("ROLE_FORBIDDEN", `Requires one of roles: ${roles.join(", ")}`));
    next();
}