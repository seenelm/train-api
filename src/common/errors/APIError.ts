import { BaseError } from "./BaseError";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export class APIError extends BaseError {
    static BadRequest(message: string, details?: unknown): APIError {
        return new APIError(
            message,
            HttpStatusCode.BAD_REQUEST,
            "BAD_REQUEST",
            details,
        );
    }

    static NotFound(message: string, details?: unknown): APIError {
        return new APIError(
            message,
            HttpStatusCode.NOT_FOUND,
            "NOT_FOUND",
            details,
        );
    }

    static InternalServerError(message: string, details?: unknown): APIError {
        return new APIError(
            message,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "INTERNAL_SERVER_ERROR",
            details,
        );
    }
}
