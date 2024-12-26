import * as Errors from "../utils/errors";
import { DatabaseError } from "../utils/errors";
import { NextFunction, Request, Response } from "express";
import CustomLogger from "../common/logger";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const logger = new CustomLogger("errorController");

    if (error instanceof DatabaseError) {
        return res.status(error.statusCode).json(error.message);
    }

    if (error instanceof Errors.CustomError) {
        logger.logError(error.message, error, {
            path: req.path,
            method: req.method,
            statusCode: error.statusCode,
            additionalFields: error.additionalFields,
        });
        return res.status(error.statusCode).json(error.message);
    }

    if (error instanceof Errors.AuthError) {
        logger.logError(error.message, error, {
            path: req.path,
            method: req.method,
            statusCode: error.statusCode,
            errors: error.errors,
        });
        return res.status(error.statusCode).json(error.errors);
    }

    logger.logError(error.message, error, {
        path: req.path,
        method: req.method,
        statusCode: 500,
    });
    return res.status(500).json(error.message);
};
