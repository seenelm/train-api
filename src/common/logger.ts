import { configure, getLogger } from "log4js";

configure({
    appenders: {
        file: {
            type: "file",
            filename: "./logs/app.log",
            maxLogSize: 20480,
            compress: true,
        },
    },
    categories: {
        default: { appenders: ["file"], level: "all"}
    }
});

const logger = getLogger();
export default logger;
