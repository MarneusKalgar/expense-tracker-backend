import { HttpStatusCodes } from "@/constants/index.js";

export class BaseError extends Error {
  public readonly httpCode: number;
  public readonly name: string;

  constructor(message = "Server error", httpCode = HttpStatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;

    this.httpCode = httpCode;

    Error.captureStackTrace(this, BaseError);
  }
}

export class AuthError extends BaseError {
  constructor(message = "Not authorized", httpCode = HttpStatusCodes.UNAUTHORIZED) {
    super(message, httpCode);

    Error.captureStackTrace(this, AuthError);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = "Bad request", httpCode = HttpStatusCodes.BAD_REQUEST) {
    super(message, httpCode);

    Error.captureStackTrace(this, BadRequestError);
  }
}

export class CreatedError extends BaseError {
  constructor(message = "Created failed", httpCode = HttpStatusCodes.CONFLICT) {
    super(message, httpCode);

    Error.captureStackTrace(this, CreatedError);
  }
}

export class DeletedError extends BaseError {
  constructor(message = "Deleted failed", httpCode = HttpStatusCodes.UNPROCESSABLE_ENTITY) {
    super(message, httpCode);

    Error.captureStackTrace(this, DeletedError);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden", httpCode = HttpStatusCodes.FORBIDDEN) {
    super(message, httpCode);

    Error.captureStackTrace(this, ForbiddenError);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Not found", httpCode = HttpStatusCodes.NOT_FOUND) {
    super(message, httpCode);

    Error.captureStackTrace(this, NotFoundError);
  }
}

export class UpdatedError extends BaseError {
  constructor(message = "Updated failed", httpCode = HttpStatusCodes.CONFLICT) {
    super(message, httpCode);

    Error.captureStackTrace(this, UpdatedError);
  }
}

export class UploadError extends BaseError {
  constructor(message = "Upload failed", httpCode = HttpStatusCodes.CONFLICT) {
    super(message, httpCode);

    Error.captureStackTrace(this, UploadError);
  }
}

export class ValidationError extends BaseError {
  constructor(message = "Validation failed", httpCode = HttpStatusCodes.BAD_REQUEST) {
    super(message, httpCode);

    Error.captureStackTrace(this, ValidationError);
  }
}
