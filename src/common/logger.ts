import { transports, format, createLogger, Logger } from "winston";

// What are your application's main buisness goals?
// What critical operations need monitoring?
// What KPIs actuall matter?
// INFO: Significant and noteworthy business events, EX: User login, User registration, etc.
// WARN: Abnornal situations that may indicate future problems, EX: Payment processing is taking longer than expected.
// ERROR: Unrecoverable errors that affect a specific operation, EX: Database connection failure, API request failure, etc.
// FATAL: Unrecoverable errors that affect the entire application, EX: Application crash, Out of memory error, etc.
// DEBUG: Detailed information for debugging purposes, EX: SQL queries, API request/response, etc.

// Things to Capture
// Request ID: Unique identifier for each request, useful for tracing logs and requests across microservices.
// Session ID: Unique identifier for each user session, useful for tracking user activity.
// User ID: Unique identifier for each user, useful for user session context
// System state data (like database or cache status)
// Full error context (stack traces when relevant)

// Add Sampling for log storage on success logs (to reduce storage costs)
// TODO: Traces vs Spans

// Retention Policy Overview
// Recent logs are kept readily available for quick debugging
// Older logs are moved to cheaper "cold" storage
// Logs are eventually deleted when they are no longer needed
// Retention periods are tailored to the importance and use case of each log type
// EX:
// Error logs: Retained for 90 days; kept longer for thorough investigation of critical issues
// Debug logs: Retained for 30 days; Short-term retention for quick debugging
// Security Audit Logs: Retained for 1 year; Longer retention for compliance and security audits

// SENSITIVE LOG DATA
// Encryption in transit - protect logs as they move from your app to storage
// Encryption at rest - protect logs when they are stored
// Access controls - restrict access to logs to only those who need it

// Logging Performance
// Choose efficient logging libraries
// Use log sampling in high-traffic paths
// Log to a separate disk partition
// Run load tests to catch logging bottlenecks early

// Structure logging
// Who, what, when, where, why
// EX:
// {
//     "timestamp": "2023-10-01T12:00:00.000Z",
//     "level": "INFO",
//     "message": "User logged in",
//     "userId": "1234567890abcdef",
//     "sourceIP", "127.0.0.1",
//     "attempt_num": 3,
//     "requestId": "1234567890abcdef",
//     "sessionId": "1234567890abcdef",
//     "service": "UserService",
//     "method": "login",
//     "status": "200",
//     "device_info": "iPhone 12",
//     "location": "New York, NY",
// }

interface LogContext {
    userId?: string;
    requestId?: string;
    correlationId?: string;
    sessionId?: string;
    sourceIP?: string;
    deviceInfo?: string;
    location?: string;
    status?: number | string;
    path?: string;
    method?: string;
}

//  METRICS: Tell you how often something happens

class CustomLogger {
    private logger: Logger;
    private className: string;

    constructor(className?: string) {
        this.className = className;
        this.logger = createLogger({
            transports: [
                new transports.File({
                    level: "info",
                    filename: "./logs/app.log",
                    handleExceptions: true,
                    format: format.combine(
                        format.timestamp(),
                        // format.json(),
                        format.timestamp({
                            format: "YYYY-MM-DDTHH:mm:ss.SSSZ",
                        }),
                        format.printf((info) => {
                            return JSON.stringify(
                                {
                                    ...info,
                                    timestamp: info.timestamp,
                                    level: info.level.toUpperCase(),
                                },
                                null,
                                2,
                            );
                        }),
                    ),
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
            ],
        });
    }

    logInfo(message: string, additionalFields: object = {}) {
        this.logger.info({ message, ...additionalFields });
    }

    logError(
        message: string,
        error?: Error,
        additionalFields?: object,
        errors?: object,
    ) {
        this.logger.error({
            message,
            errorMessage: error.message,
            ...additionalFields,
            ...errors,
            stack: error.stack,
        });
    }
}

export default CustomLogger;
