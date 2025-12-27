import jwt from 'jsonwebtoken';
import { E } from '../utils/appError.js';

export function authRequired(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        return next(E.unauthorized("NO_TOKEN", "Missing or invalid authorization token"));
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info to request
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (err) {
        return next(E.unauthorized("INVALID_TOKEN", "Invalid or expired authorization token"));
    }
}