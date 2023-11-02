import * as Errors from "../utils/errors";
import { NextFunction, Request, Response } from "express";

function handleInternalServerError(error: any, res: Response) {
  res.status(error.statusCode);
}

function handleConflictError(error: any, res: Response) {
  res.status(error.statusCode).json(error.errors);
}

function handleResourceNotFoundError(error: any, res: Response) {
  res.status(error.statusCode);
}

function handleCustomError(error: any, res: Response) {
  res.status(error.statusCode).json(error.errors);
}

export const errorController = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Errors.ConflictError) {
    error = handleConflictError(error, res);
  }
  if (error instanceof Errors.InternalServerError) {
    error = handleInternalServerError(error, res);
  }
  if (error instanceof Errors.ResourceNotFoundError) {
    error = handleResourceNotFoundError(error, res);
  }
  if (error instanceof Errors.CustomError) {
    error = handleCustomError(error, res);
  }
};
