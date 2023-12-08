import { transports, format, createLogger, Logger } from "winston";

class CustomLogger {
  private logger: Logger;
  private className: string;

  constructor(className: string) {
    this.className = className;
    this.logger = createLogger({
      transports: [
        new transports.File({
          level: "info",
          filename: "./logs/app.log",
          handleExceptions: true,
          format: format.combine(format.timestamp(), format.json()),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
  }

  logInfo(message: string, additionalFields: object = {}) {
    this.logger.info(message, additionalFields);
  }

  logError(message: string, error: Error, additionalFields: object = {}) {
    const loggingError = new Error(message);
    this.logger.error(message, {
      ...additionalFields,
      errorMessage: error.message,
      stack: loggingError.stack,
    });
  }
}

export default CustomLogger;

// configure({
//     appenders: {
//         file: {
//             type: "file",
//             filename: "./logs/app.log",
//             maxLogSize: 20480,
//             backups: 10,
//             compress: true,
//         },
//         errorFile: {
//             type: "file",
//             filename: "./logs/errors.log",
//             maxLogSize: 20480,
//             backups: 10,
//             compress: true,
//         },
//     },
//     categories: {
//         default: { appenders: ["file"], level: "info" },
//         error: { appenders: ["errorFile"], level: "error" }
//     }
// });

// const logger = getLogger();
// const errorLogger = getLogger("error");

// export { logger, errorLogger };
