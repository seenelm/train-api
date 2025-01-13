import { ErrorResponse } from "./types";

export abstract class ServerError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number,
        public readonly errorCode: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    public toJSON(): ErrorResponse {
        return {
            message: this.message,
            errorCode: this.errorCode,
            details: this.details,
        };
    }
}
