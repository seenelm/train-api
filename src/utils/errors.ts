export class CustomError extends Error {
  public statusCode: number;
  public errors: any;

  constructor(errors: any, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
  }
};

export class BadRequestError extends Error {
  public statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class ConflictError extends Error {
  public errors: any;
  public statusCode: number;

  constructor(message: string, errors: any) {
    super(message);
    this.statusCode = 409;
    this.errors = errors;
  }
};

export class ResourceNotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ResourceNotFoundError";
    this.statusCode = 404;
  }
};

export class InternalServerError extends Error {
  public statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
};

export class ForbiddenError extends Error {
  public statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
};

export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
