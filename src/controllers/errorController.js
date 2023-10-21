import * as Errors from "../utils/errors.js";

function handleInternalServerError(error, res) {
  res.status(error.statusCode);
}

function handleConflictError(error, res) {
  console.log(error.errors);
  res.status(error.statusCode).json(error.errors);
}

function handleResourceNotFoundError(error, res) {
  res.status(error.statusCode);
}

export const errorController = (error, req, res, next) => {
  if (error instanceof Errors.ConflictError) {
    error = handleConflictError(error, res);
  }
  if (error instanceof Errors.InternalServerError) {
    error = handleInternalServerError(error, res);
  }
  if (error instanceof Errors.ResourceNotFoundError) {
    error = handleResourceNotFoundError(error, res);
  }
};
