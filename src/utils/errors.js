export const CustomError = class CustomError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

export const ConflictError = class ConflictError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
    this.errors = errors;
  }
};

export const ResourceNotFoundError = class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceNotFoundError";
    this.statusCode = 404;
  }
};

export const InternalServerError = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
};
