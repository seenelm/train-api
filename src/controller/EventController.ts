import EventService from "../service/EventService";
import { EventRequest } from "../dto/EventRequest";
import { EventResponse } from "../dto/EventResponse";
import { Request, Response, NextFunction } from "express";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { UserEventResponse } from "../dto/UserEventResponse";
import { ObjectId } from "mongodb";

export default class EventController {
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    addEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createEventRequest: EventRequest = new EventRequest.Builder()
                .setName(req.body.name)
                .setAdmin(req.body.admin.map((id: string) => new ObjectId(id)))
                .setInvitees(
                    req.body.invitees.map((id: string) => new ObjectId(id)),
                )
                .setStartTime(req.body.startTime)
                .setEndTime(req.body.endTime)
                .setLocation(req.body.location)
                .setDescription(req.body.description)
                .build();

            const eventResponse: EventResponse =
                await this.eventService.addEvent(createEventRequest);
            return res.status(HttpStatusCode.CREATED).json(eventResponse);
        } catch (error) {
            next(error);
        }
    };

    getUserEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: ObjectId = new ObjectId(req.params.userId);

            const userEventResponseList: UserEventResponse[] =
                await this.eventService.getUserEvents(userId);
            console.log("userEventResponseList", userEventResponseList);
            return res.status(HttpStatusCode.OK).json(userEventResponseList);
        } catch (error) {
            next(error);
        }
    };

    updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId: ObjectId = new ObjectId(req.params.eventId);
            const updateEventRequest: EventRequest = new EventRequest.Builder()
                .setName(req.body.name)
                .setAdmin(req.body.admin.map((id: string) => new ObjectId(id)))
                .setInvitees(
                    req.body.invitees.map((id: string) => new ObjectId(id)),
                )
                .setStartTime(req.body.startTime)
                .setEndTime(req.body.endTime)
                .setLocation(req.body.location)
                .setDescription(req.body.description)
                .build();

            await this.eventService.updateEvent(updateEventRequest, eventId);
            return res.status(HttpStatusCode.OK);
        } catch (error) {
            next(error);
        }
    };

    updateUserEventStatus = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const eventId: ObjectId = new ObjectId(req.params.eventId);
            const userId: ObjectId = new ObjectId(req.params.userId);
            const eventStatus: number = parseInt(req.body.status);

            await this.eventService.updateUserEventStatus(
                eventStatus,
                userId,
                eventId,
            );
            return res.status(HttpStatusCode.OK);
        } catch (error) {
            next(error);
        }
    };
}
