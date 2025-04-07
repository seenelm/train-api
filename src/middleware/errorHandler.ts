import { NextFunction, Request, Response } from "express";
import CustomLogger from "../common/logger";
import { ServerError } from "../common/errors/ServerError";
import { APIError } from "../common/errors/APIError";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const logger = new CustomLogger("errorController");
    // log error

    if (error instanceof ServerError) {
        const errorResponse = error.toJSON();
        return res.status(error.statusCode).json(errorResponse);
    }

    const unknownError = APIError.InternalServerError("Unknown error occurred");
    const errorResponse = unknownError.toJSON();

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(errorResponse);
};
