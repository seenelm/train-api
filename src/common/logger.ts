import pino from "pino";

const fileTransport = pino.transport({
    target: "pino/file",
    options: { destination: "./logs/app.log" }
});

const logger = pino({
    level: "info"
}, fileTransport);

export default logger;