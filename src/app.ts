import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";

import MongoDB from "./dao/MongoDB";
import { errorHandler } from "./middleware/errorHandler";

import userRouter from "./route/userRouter";
import groupRouter from "./route/groupRouter";
import userProfileRouter from "./route/userProfileRouter";
import searchRouter from "./route/searchRouter";
import eventRouter from "./route/eventRouter";
import fileRouter from "./route/fileRouter";
import programRouter from "./app/programs/routes/programRoutes";
import exerciseLibraryRouter from "./app/exerciseLibrary/exerciseLibraryRouter";
import mediaHubRouter from "./app/mediaHub/mediaHubRouter";

import { Event } from "./model/eventModel";
import admin from "./infrastructure/firebase";
import Agenda from "agenda";
import { EventRequest } from "./dto/EventRequest";
import { EventResponse } from "./dto/EventResponse";
import { AlertModel } from "./model/alertModel";

import config from "./common/config";

const app = express();
// const dbUri: string = config.get("MongoDB.dbConfig.host");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const dbUri: string = config.database.uri;

const db = new MongoDB(dbUri);
const agenda = new Agenda({
    db: { address: dbUri, collection: "notificationschedular" },
    processEvery: "30 seconds",
});

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

// agenda.define("send push notification", async (job) => {
//     const { token, title, body, data } = job.attrs.data;
//     try {
//         const response = await admin.messaging().send({
//             token,
//             notification: {
//                 title,
//                 body,
//             },
//             data: data || {},
//         });
//         console.log("Successfully sent notification:", response);
//         return response;
//     } catch (error) {
//         console.error("Error sending notification:", error);
//         throw error;
//     }
// });

// agenda.define("send push notification", async (job) => {
//     const { eventId, scheduledTime, title } = job.attrs.data;
//     try {
//         const event = (await Event.findById(eventId)).populated("invitees");
//         if (!event) {
//             console.error("Event not found");
//             return;
//         }

//         const invitees = event.invitees;
//         const deviceTokens = invitees.map((invitee) => invitee.deviceToken);

//         if (deviceTokens.length === 0) {
//             console.error("No device tokens found");
//             return;
//         }

//         const message = {
//             notification: {
//                 title,
//                 body: `Event starts in ${scheduledTime} minutes`,
//             },
//             tokens: deviceTokens,
//         };

//         const response = await admin.messaging().sendEachForMulticast(message);
//         console.log(
//             `Sent reminders for event ${event.title}. Success: ${response.successCount}, Failure: ${response.failureCount}`,
//         );

//         if (response.failureCount > 0) {
//             response.responses.forEach((resp, idx) => {
//                 if (!resp.success) {
//                     console.error(
//                         `Failed to send notification to token: ${deviceTokens[idx]}, Error:`,
//                         resp.error,
//                     );
//                 }
//             });
//         }
//     } catch (error) {
//         console.error("Error sending notification:", error);
//         throw error;
//     }
// });

// async function scheduleNotification(event: EventResponse) {
//     const alerts = await AlertModel.findById(event.getAlerts());
//     if (!alerts) {
//         console.error("Alerts not found");
//         return;
//     }

//     for (const alert of alerts.alerts) {
//         const scheduledTime = event.getStartTime();
//         scheduledTime.setMinutes(
//             scheduledTime.getMinutes() - alert.getMinutes(),
//         );

//         if (scheduledTime > new Date()) {
//             const jobId = `alert-event-${event.getId()}-${alert.getMinutes()}`;

//             await agenda.schedule(scheduledTime, "send push notification", {
//                 eventId: event.getId(),
//                 alert,
//                 title: event.getName(),
//             });
//         }
//     }
// }

app.use("/api", userRouter);
app.use("/api/users", userProfileRouter);
app.use("/api/groups", groupRouter);
app.use("/api/events", eventRouter);
app.use("/api", searchRouter);
app.use("/api/files", fileRouter);
app.use("/api/programs", programRouter);
app.use("/api/exercise-library", exerciseLibraryRouter);
app.use("/api/media-hub", mediaHubRouter);

app.use(errorHandler);

export { app, db };
