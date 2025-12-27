export class AppError extends Error {
    constructor({ status = 500, code = "INTERNAL_ERROR", message = "Unexpected error", details = null }) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}


export const E = {
  badRequest: (code, message, details=null) => new AppError({ status: 400, code, message, details }),
  unauthorized: (code="UNAUTHORIZED", message="Unauthorized", details=null) => new AppError({ status: 401, code, message, details }),
  forbidden: (code="FORBIDDEN", message="Forbidden", details=null) => new AppError({ status: 403, code, message, details }),
  notFound: (code, message="Not found", details=null) => new AppError({ status: 404, code, message, details }),
  conflict: (code, message, details=null) => new AppError({ status: 409, code, message, details }),
}