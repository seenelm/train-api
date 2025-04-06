import { app, db } from "./app";
import mongoose from "mongoose";

let server: any = null;

db.connect()
    .then(() => {
        mongoose.set("debug", true);
        server = app.listen(3000, () => {
            console.log(`Server is running on port ${3000}`);
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
