import express from "express";
import "dotenv/config";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import config from "config";

import MongoDB from "./dataAccess/MongoDB";
import { errorController } from "./controllers/errorController";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import groupRouter from "./routes/groupRouter";

const dbUri = config.get("MongoDB.dbConfig.host");
const port = config.get("MongoDB.dbConfig.port");

const db = new MongoDB(dbUri);

app.use(async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    await db.connect();
  }
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);

app.use(errorController);

const server = app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
});

process.on("SIGINT", () => {
  db.close().then(() => {
    process.exit(0);
  });
});

export { app, server };
