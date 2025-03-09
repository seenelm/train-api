import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import config from "config";

import MongoDB from "./dao/MongoDB";
import { errorHandler } from "./middleware/errorHandler";

import userRouter from "./route/userRouter";
import groupRouter from "./route/groupRouter";
import userProfileRouter from "./route/userProfileRouter";
import searchRouter from "./route/searchRouter";
import eventRouter from "./route/eventRouter";
import fileRouter from "./route/fileRouter";

import messaging from "./infrastructure/firebase";

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
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
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

app.post("/api/send-notification", async (req, res) => {
    const { token, title, body } = req.body;
    const message = {
        notification: {
            title,
            body,
        },
        token,
    };
    try {
        const response = await messaging.send(message);
        console.log("Notification Sent:", response);
        return res.status(200).json({ success: true, response });
    } catch (error) {
        console.error("Error sending notification:", error);
        return res.status(500).json({ success: false, error });
    }
});

app.use("/api", userRouter);
app.use("/api/users", userProfileRouter);
app.use("/api/groups", groupRouter);
app.use("/api/events", eventRouter);
app.use("/api", searchRouter);
app.use("/api", fileRouter);

app.use(errorHandler);

export { app, db };
