import express from "express";
import "dotenv/config";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import config from "config";

import MongoDB from "./dataAccess/MongoDB";
import { errorController } from "./controllers/errorController";

import userRouter from "./routes/userRouter";
import userGroupsRouter from "./routes/userGroupsRouter";
import groupRouter from "./routes/groupRouter";
import userProfileRouter from "./routes/userProfileRouter";
import searchRouter from "./routes/searchRouter";

const dbUri = config.get("MongoDB.dbConfig.host");
const port = config.get("MongoDB.dbConfig.port");

const db = new MongoDB(dbUri);

app.use(async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    // mongoose.set("debug", (coll, method, query, doc) => {
    //   console.log(`Mongoose debug: ${coll}.${method}`, query);
    //   console.trace();
    // });
    mongoose.set("debug", true);
    await db.connect();
  }
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", userRouter);
app.use("/api/users", userGroupsRouter);
app.use("/api/user-profile/users", userProfileRouter);
app.use("/api/groups", groupRouter);
app.use("/api", searchRouter);

app.use(errorController);

// const server = app.listen(port, () => {
//   console.log(`APP IS LISTENING ON PORT ${port}`);
// });

// process.on("SIGINT", () => {
//   db.close().then(() => {
//     process.exit(0);
//   });
// });

export { app, db };
