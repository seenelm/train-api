import { app, db } from "./app";
import config from "config";
import mongoose from "mongoose";

const port = config.get("MongoDB.dbConfig.port");
let server: any = null;

db.connect()
    .then(() => {
        mongoose.set("debug", true);
        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    });

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("SIGINT", () => {
    db.close().then(() => {
        console.log("Database connection closed");
        process.exit(0);
    });
});

export { server, db };
