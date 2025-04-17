import { app, db } from "./app";
import mongoose from "mongoose";
import config from "./common/config";

let server: any = null;
const port = config.server.port || 3000;

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
