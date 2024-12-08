import express from "express";
const eventRouter = express.Router();
import { EventController } from "../controller/EventController";
import { EventService } from "../service/EventService";
import { EventDAO } from "../dao/EventDAO";
import { authenticate } from "../__middleware__/authenticate";
import { Event } from "../model/eventModel";

const eventDAO = new EventDAO(Event);
const eventService = new EventService(eventDAO);
const eventController = new EventController(eventService);

eventRouter.post("/", authenticate, eventController.addEvent);

export default eventRouter;
