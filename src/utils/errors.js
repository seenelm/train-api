module.exports.CustomError = class CustomError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

module.exports.ConflictError = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
};

module.exports.ResourceNotFoundError = class ResourceNotFoundError extends (
  Error
) {
  constructor(message) {
    super(message);
    this.name = "ResourceNotFoundError";
    this.statusCode = 404;
  }
};

module.exports.InternalServerError = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
};
