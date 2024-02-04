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
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const db = new MongoDB(dbUri);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Train API",
            version: "1.0.0",
            description: "Train API",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
        basePath: "/api",
    },
    apis: ["./config/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", userRouter);
app.use("/api/users", userProfileRouter);
app.use("/api/groups", groupRouter);
app.use("/api", searchRouter);

app.use(errorController);

export { app, db };
