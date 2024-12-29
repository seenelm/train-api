import EventService from "../service/EventService";
import { CreateEventRequest } from "../dto/CreateEventRequest";
import { CreateEventResponse } from "../dto/CreateEventResponse";
import { Request, Response, NextFunction } from "express";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { UserEventResponse } from "../dto/UserEventResponse";
import { ObjectId } from "mongodb";

export class EventController {
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    addEvent = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        console.log("AddEvent", req.body);
        try {
            const createEventRequest: CreateEventRequest = 
                new CreateEventRequest.Builder()
                    .setName(req.body.name)
                    .setAdmin(req.body.admin)
                    .setInvitees(req.body.invitees)
                    .setDate(new Date(req.body.date))
                    .setStartTime(
                        new Date(`${req.body.date}T${req.body.startTime}:00`) // Combine date and time
                    )
                    .setEndTime(
                        new Date(`${req.body.date}T${req.body.endTime}:00`) // Combine date and time
                    )
                    .setLocation(req.body.location)
                    .setDescription(req.body.description)
                    .build();

            console.log("CreateEventRequest: ", createEventRequest);
            const createEventResponse: CreateEventResponse =
                await this.eventService.addEvent(createEventRequest);
            res.status(HttpStatusCode.CREATED).json(createEventResponse);
        } catch (error) {
            console.log("Error: ", error);
            next(error);
        }
    }

    getUserEvents = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            console.log("params: ", req.params);
            const userId: ObjectId = new ObjectId(req.params.userId);
            console.log("UserId: ", userId);
            const userEventResponseList: UserEventResponse[] =
                await this.eventService.getUserEvents(userId);
            res.status(HttpStatusCode.OK).json(userEventResponseList);
        } catch (error) {
            next(error);
        }
    }
}
