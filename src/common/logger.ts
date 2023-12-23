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
          format: format.combine(
            format.timestamp(),
            // format.json(),
            format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
            format.printf((info) => {
              return JSON.stringify(
                {
                  ...info,
                  timestamp: info.timestamp,
                  level: info.level.toUpperCase(),
                },
                null,
                2
              );
            })
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
    error: Error,
    additionalFields: object = {},
    errors: object = {}
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
