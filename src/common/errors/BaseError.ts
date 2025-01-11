import { ErrorResponse } from "./types";

export abstract class BaseError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number,
        public readonly code: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    public toJSON(): ErrorResponse {
        return {
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            timestamp: new Date().toISOString(),
            details: this.details,
        };
    }
}
