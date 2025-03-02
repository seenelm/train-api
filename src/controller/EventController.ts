import EventService from "../service/EventService";
import { EventRequest } from "../dto/EventRequest";
import { EventResponse } from "../dto/EventResponse";
import { Request, Response, NextFunction } from "express";
import { StatusCodes as HttpStatusCode } from "http-status-codes";
import { UserEventResponse } from "../dto/UserEventResponse";
import { ObjectId } from "mongodb";
import UserEventStatusRequest from "../dto/UserEventStatusRequest";

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

    getUserEventById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId: ObjectId = new ObjectId(req.params.userId);
            const eventId: ObjectId = new ObjectId(req.params.eventId);

            const userEventResponse: UserEventResponse =
                await this.eventService.getUserEventById(userId, eventId);
            return res.status(HttpStatusCode.OK).json(userEventResponse);
        } catch (error) {
            next(error);
        }
    };

    updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId: ObjectId = new ObjectId(req.params.eventId);
            const adminId: ObjectId = new ObjectId(req.params.adminId);

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

            await this.eventService.updateEvent(
                updateEventRequest,
                eventId,
                adminId,
            );
            return res.status(HttpStatusCode.OK).json({ message: "sucess" });
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
            const userEventStatusRequest: UserEventStatusRequest =
                new UserEventStatusRequest(
                    req.body.userId,
                    req.body.eventStatus,
                );

            await this.eventService.updateUserEventStatus(
                eventId,
                userEventStatusRequest,
            );
            return res.status(HttpStatusCode.OK).json({ message: "sucess" });
        } catch (error) {
            next(error);
        }
    };

    deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId: ObjectId = new ObjectId(req.params.eventId);
            const adminId: ObjectId = new ObjectId(req.params.adminId);

            await this.eventService.deleteEvent(eventId, adminId);
            return res.status(HttpStatusCode.OK).json({ message: "sucess" });
        } catch (error) {
            next(error);
        }
    };

    deleteUserEvent = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId: ObjectId = new ObjectId(req.params.userId);
            const eventId: ObjectId = new ObjectId(req.params.eventId);

            await this.eventService.deleteUserEvent(eventId, userId);
            return res.status(HttpStatusCode.OK).json({ message: "sucess" });
        } catch (error) {
            next(error);
        }
    };

    removeUserFromEvent = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId: ObjectId = new ObjectId(req.params.userId);
            const eventId: ObjectId = new ObjectId(req.params.eventId);
            const adminId = req.user._id;

            await this.eventService.removeUserFromEvent(
                eventId,
                userId,
                adminId,
            );
            return res.status(HttpStatusCode.OK).json({ message: "sucess" });
        } catch (error) {
            next(error);
        }
    };
}
