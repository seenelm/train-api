import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";
import { MongoServerErrorType } from "../common/enums";

export class DatabaseError extends Error {
    public code: string;
    public statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR;

    constructor(message: string, code: string, statusCode: number) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

export const handleDatabaseError = (error: unknown): DatabaseError => {
    console.error("Error: ", error);
    if (error instanceof MongooseError.ValidationError) {
        return new DatabaseError(
            error.message,
            MongoServerErrorType.ValidationError,
            HttpStatusCode.BAD_REQUEST,
        );
    }
    if (error instanceof MongooseError.CastError) {
        return new DatabaseError(
            error.message,
            MongoServerErrorType.CastError,
            HttpStatusCode.BAD_REQUEST,
        );
    }
    if (error instanceof MongooseError.DocumentNotFoundError) {
        return new DatabaseError(
            error.message,
            MongoServerErrorType.DocumentNotFoundError,
            HttpStatusCode.NOT_FOUND,
        );
    }
    if (error instanceof MongoServerError) {
        if (error.code === 11000) {
            return new DatabaseError(
                error.message,
                MongoServerErrorType.DuplicateKeyError,
                HttpStatusCode.CONFLICT,
            );
        }
        return new DatabaseError(
            error.message,
            MongoServerErrorType.MongoServerError,
            HttpStatusCode.SERVICE_UNAVAILABLE,
        );
    }

    return new DatabaseError(
        "Unknown database error occurred",
        "UNEXPECTED_ERROR",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
};

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
        additionalFields: object = {},
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
