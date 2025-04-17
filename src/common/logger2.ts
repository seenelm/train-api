import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const { combine, timestamp, json, prettyPrint, errors } = winston.format;
const loggingWinston = new LoggingWinston();

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

const logger = winston.createLogger({
    level: "info",
    format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint(),
    ),
    transports: [new winston.transports.Console()],
    defaultMeta: { service: "train-api" },
});

const requestLog = { method: "GET", isAuthorized: false };
const childLogger = logger.child(requestLog);

childLogger.info("This is a child logger message");
childLogger.error("Error message", new Error("Test error"));
