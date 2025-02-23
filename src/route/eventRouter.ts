import express from "express";
const eventRouter = express.Router();
import EventController from "../controller/EventController";
import EventService from "../service/EventService";
import EventDAO from "../dao/EventDAO";
import { authenticate } from "../middleware/authenticate";
import { Event } from "../model/eventModel";
import UserEventDAO from "../dao/UserEventDAO";
import { UserEvent } from "../model/userEventModel";
import EventMiddleware from "../middleware/EventMiddleware";

const eventDAO = new EventDAO(Event);
const userEventDAO = new UserEventDAO(UserEvent);
const eventService = new EventService(eventDAO, userEventDAO);
const eventController = new EventController(eventService);

eventRouter.post(
    "/",
    authenticate,
    EventMiddleware.validateAddEvent,
    eventController.addEvent,
);
eventRouter.put(
    "/:eventId/users/:adminId",
    authenticate,
    eventController.updateEvent,
);

eventRouter.get("/users/:userId", authenticate, eventController.getUserEvents);
eventRouter.get(
    "/:eventId/users/:userId",
    authenticate,
    eventController.getUserEventById,
);
eventRouter.put(
    "/:eventId/status",
    authenticate,
    eventController.updateUserEventStatus,
);

export default eventRouter;
