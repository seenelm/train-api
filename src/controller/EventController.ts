import EventService from "../service/EventService";
import { CreateEventRequest } from "../dto/CreateEventRequest";
import { CreateEventResponse } from "../dto/CreateEventResponse";
import { Request, Response, NextFunction } from "express";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { UserEventResponse } from "../dto/UserEventResponse";
import { ObjectId } from "mongodb";

export default class EventController {
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    addEvent = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const createEventRequest: CreateEventRequest =
                new CreateEventRequest.Builder()
                    .setName(req.body.name)
                    .setAdmin(req.body.admin)
                    .setInvitees(req.body.invitees)
                    .setStartTime(req.body.startTime)
                    .setEndTime(req.body.endTime)
                    .setLocation(req.body.location)
                    .setDescription(req.body.description)
                    .build();

            const createEventResponse: CreateEventResponse =
                await this.eventService.addEvent(createEventRequest);
            res.status(HttpStatusCode.CREATED).json(createEventResponse);
        } catch (error) {
            next(error);
        }
    };

    getUserEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: ObjectId = new ObjectId(req.params.userId);

            const userEventResponseList: UserEventResponse[] =
                await this.eventService.getUserEvents(userId);
            res.status(HttpStatusCode.OK).json(userEventResponseList);
        } catch (error) {
            next(error);
        }
    };
}
