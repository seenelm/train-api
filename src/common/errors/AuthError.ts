import { BaseError } from "./BaseError";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export class AuthError extends BaseError {
    static Unauthorized(
        message: string = "Unauthorized",
        details?: unknown,
    ): AuthError {
        return new AuthError(
            message,
            HttpStatusCode.UNAUTHORIZED,
            "UNAUTHORIZED",
            details,
        );
    }

    static Forbidden(
        message: string = "Forbidden",
        details?: unknown,
    ): AuthError {
        return new AuthError(
            message,
            HttpStatusCode.FORBIDDEN,
            "FORBIDDEN",
            details,
        );
    }
}
