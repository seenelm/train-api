import { StatusCodes as HttpStatusCode } from "http-status-codes";

export class AuthError extends Error {
  public statusCode: number;
  public errors: object;

  constructor(errors: object = {}, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class CustomError extends Error {
  public statusCode: number;
  public additionalFields: object;

  constructor(
    message: string,
    statusCode: number,
    additionalFields: object = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.additionalFields = additionalFields;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, additionalFields: object = {}) {
    super(message, HttpStatusCode.BAD_REQUEST, additionalFields);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, additionalFields: object = {}) {
    super(message, HttpStatusCode.CONFLICT, additionalFields);
  }
}

export class ResourceNotFoundError extends CustomError {
  constructor(message: string, additionalFields: object = {}) {
    super(message, HttpStatusCode.NOT_FOUND, additionalFields);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, additionalFields: object = {}) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, additionalFields);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string, additionalFields: object = {}) {
    super(message, HttpStatusCode.FORBIDDEN, additionalFields);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string, additionalFields: object = {}) {
    super(message, HttpStatusCode.UNAUTHORIZED, additionalFields);
  }
}
