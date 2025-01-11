export interface ErrorResponse {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    details?: unknown;
}
