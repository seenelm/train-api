import { configure, getLogger } from "log4js";

configure({
    appenders: {
        file: {
            type: "file",
            filename: "./logs/app.log",
            maxLogSize: 20480,
            backups: 10,
            compress: true,
        },
        errorFile: {
            type: "file",
            filename: "./logs/errors.log",
            maxLogSize: 20480,
            backups: 10,
            compress: true,
        },
    },
    categories: {
        default: { appenders: ["file"], level: "info" },
        error: { appenders: ["errorFile"], level: "error" }
    }
});

const logger = getLogger();
const errorLogger = getLogger("error");

export { logger, errorLogger };
