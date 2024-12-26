import { EventDAO } from "../dao/EventDAO";
import { UserEventDAO } from "../dao/UserEventDAO";
import { CreateEventRequest } from "../dto/request/CreateEventRequest";
import { CreateEventResponse } from "../dto/response/CreateEventResponse";
import { IEvent } from "../model/eventModel";
import { ObjectId } from "mongodb";
import { InternalServerError } from "../utils/errors";
import mongoose from "mongoose";

export class EventService {
    private eventDAO: EventDAO;
    private userEventDAO: UserEventDAO;

    constructor(eventDAO: EventDAO, userEventDAO: UserEventDAO) {
        this.eventDAO = eventDAO;
        this.userEventDAO = userEventDAO;
    }

    public async addEvent(
        createEventRequest: CreateEventRequest,
    ): Promise<CreateEventResponse> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Check if event already exists
            const event: IEvent = await this.eventDAO
                .create(createEventRequest, { session })
                .catch((error) => {
                    // add logging - detailed error message returned from mongoDB
                    throw new InternalServerError("Failed to create event");
                });

            // Add event into user's event list
            this.upsertAdminEvents(
                createEventRequest.getAdmin(),
                event,
                session,
            );

            this.upsertInviteeEvents(
                createEventRequest.getInvitees(),
                event,
                session,
            );

            await session.commitTransaction();
            session.endSession();

            const createEventResponse: CreateEventResponse =
                CreateEventResponse.from(event);
            return createEventResponse;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error adding event: ", error);
            throw new InternalServerError("Failed to add event");
        }
    }

    private async upsertAdminEvents(
        admins: ObjectId[],
        event: IEvent,
        session: mongoose.ClientSession,
    ): Promise<void> {
        for (const admin of admins) {
            try {
                await this.userEventDAO.findOneAndUpdate(
                    { userId: admin },
                    { $push: { events: { eventId: event._id } } },
                    { upsert: true, session },
                );
            } catch (error) {
                // add logging - detailed error message returned from mongoDB
                throw new InternalServerError(
                    "Failed to add event to admin's event list",
                );
            }
        }
    }

    private async upsertInviteeEvents(
        invitees: ObjectId[],
        event: IEvent,
        session: mongoose.ClientSession,
    ): Promise<void> {
        for (const invitee of invitees) {
            try {
                await this.userEventDAO.findOneAndUpdate(
                    { userId: invitee },
                    { $push: { events: { eventId: event._id } } },
                    { upsert: true, session },
                );
            } catch (error) {
                // add logging - detailed error message returned from mongoDB
                throw new InternalServerError(
                    "Failed to add event to invitee's event list",
                );
            }
        }
    }
}
