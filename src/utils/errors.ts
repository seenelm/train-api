export enum HttpStatusCode {
  BAD_REQUEST = 400,
  CONFLICT = 409,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  FORBIDDEN = 403,
  UNAUTHORIZED = 401,
  OK = 200,
  CREATED = 201,
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
    super(message, HttpStatusCode.INTERNAL_SERVER, additionalFields);
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
