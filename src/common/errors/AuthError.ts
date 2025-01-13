import { ServerError } from "./ServerError";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export class AuthError extends ServerError {
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

    static InvalidToken(
        message: string = "Invalid token",
        details?: unknown,
    ): AuthError {
        return new AuthError(
            message,
            HttpStatusCode.UNAUTHORIZED,
            "INVALID_TOKEN",
            details,
        );
    }

    static TokenExpired(
        message: string = "Token expired",
        details?: unknown,
    ): AuthError {
        return new AuthError(
            message,
            HttpStatusCode.UNAUTHORIZED,
            "TOKEN_EXPIRED",
            details,
        );
    }
}
