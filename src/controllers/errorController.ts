import * as Errors from "../utils/errors";
import { NextFunction, Request, Response } from "express";
import CustomLogger from "../common/logger";

export const errorController = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = new CustomLogger("errorController");
  if (error instanceof Errors.CustomError) {
    logger.logError(error.message, error, {
      path: req.path,
      method: req.method,
      statusCode: error.statusCode,
      additionalFields: error.additionalFields,
    });
    res.status(error.statusCode).json(error.message);
  } else if (error instanceof Errors.AuthError) {
    logger.logError(error.message, error, {
      path: req.path,
      method: req.method,
      statusCode: error.statusCode,
      errors: error.errors,
    });
    res.status(error.statusCode).json(error.errors);
  } else {
    logger.logError(error.message, error, {
      path: req.path,
      method: req.method,
      statusCode: 500,
    });
    res.status(500).json(error.message);
  }
};
