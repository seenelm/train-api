import { app, db } from "./app";
import config from "config";

const port = config.get("MongoDB.dbConfig.port");

const server = app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}`);
});

process.on("SIGINT", () => {
    db.close().then(() => {
        process.exit(0);
    });
});

export { server };