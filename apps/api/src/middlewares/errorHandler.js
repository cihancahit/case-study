import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";

const buildErr = (req,code,message,details = null) =>({
    error:{code,message,details,requestId:req.requestId || null},
})

export function errorHandler(err, req, res, next) {
    if(err instanceof ZodError) {
        const details = err.issues.map(i => ({ path: i.path.join("."), message: i.message, code: i.code }));
        return res.status(400).json(buildErr(req, "VALIDATION_ERROR", "Invalid request body", details));
    }
    if(err instanceof AppError) {
       return res.status(err.status).json(buildErr(req, err.code, err.message, err.details)); 
    }
    console.error("[UNHANDLED_ERROR]", { requestId: req.requestId, message: err?.message, stack: err?.stack });
    return res.status(500).json(buildErr(req, "INTERNAL_ERROR", "Unexpected error"));
}