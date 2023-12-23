import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import config from "config";

import MongoDB from "./dataAccess/MongoDB";
import { errorController } from "./controllers/errorController";

import userRouter from "./routes/userRouter";
import groupRouter from "./routes/groupRouter";
import userProfileRouter from "./routes/userProfileRouter";
import searchRouter from "./routes/searchRouter";

const app = express();
const dbUri = config.get("MongoDB.dbConfig.host");

const db = new MongoDB(dbUri);

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", userRouter);
app.use("/api/users", userProfileRouter);
app.use("/api/groups", groupRouter);
app.use("/api", searchRouter);

app.use(errorController);

export { app, db };
