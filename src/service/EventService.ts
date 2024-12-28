import EventDAO from "../dao/EventDAO";
import UserEventDAO from "../dao/UserEventDAO";
import { CreateEventRequest } from "../dto/CreateEventRequest";
import { CreateEventResponse } from "../dto/CreateEventResponse";
import { IEvent } from "../model/eventModel";
import { ObjectId } from "mongodb";
import { InternalServerError, handleMongoDBError } from "../utils/errors";
import mongoose from "mongoose";
import { UserEventEntity } from "../entity/UserEventEntity";
import { ResourceNotFoundError } from "../utils/errors";
import { UserEventResponse } from "../dto/UserEventResponse";

export default class EventService {
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
            const event: IEvent = await this.eventDAO.create(
                createEventRequest,
                { session },
            );

            // Add event into user's event list
            await Promise.all([
                this.upsertAdminEvents(
                    createEventRequest.getAdmin(),
                    event,
                    session,
                ),

                this.upsertInviteeEvents(
                    createEventRequest.getInvitees(),
                    event,
                    session,
                ),
            ]);

            await session.commitTransaction();
            session.endSession();

            return CreateEventResponse.from(event);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            // console.error("Error adding event: ", error);
            throw handleMongoDBError(error);
        }
    }

    public async getEvent(
        userId: ObjectId,
        eventId: ObjectId,
    ): Promise<UserEventResponse> {
        try {
            const userEventEntity: UserEventEntity =
                await this.userEventDAO.findUserEvent(userId, eventId);

            if (!userEventEntity) {
                throw new ResourceNotFoundError("Event not found");
            }

            return UserEventResponse.from(userEventEntity);
        } catch (error) {
            throw handleMongoDBError(error);
        }
    }

    private async upsertAdminEvents(
        admins: ObjectId[],
        event: IEvent,
        session: mongoose.ClientSession,
    ): Promise<void> {
        try {
            const promises = admins.map((admin) => {
                this.userEventDAO.findOneAndUpdate(
                    { userId: admin },
                    { $push: { events: { eventId: event._id } } },
                    { upsert: true, session },
                );
            });
            await Promise.all(promises);
        } catch (error) {
            // add logging - detailed error message returned from mongoDB
            console.error("Failed to add event to admin's event list: ", error);
            throw new InternalServerError(
                "Failed to add event to admin's event list",
            );
        }
    }

    private async upsertInviteeEvents(
        invitees: ObjectId[],
        event: IEvent,
        session: mongoose.ClientSession,
    ): Promise<void> {
        try {
            const promises = invitees.map((invitee) => {
                this.userEventDAO.findOneAndUpdate(
                    { userId: invitee },
                    { $push: { events: { eventId: event._id } } },
                    { upsert: true, session },
                );
            });
            await Promise.all(promises);
        } catch (error) {
            // add logging - detailed error message returned from mongoDB
            console.error(
                "Failed to add event to invitee's event list: ",
                error,
            );
            throw new InternalServerError(
                "Failed to add event to invitee's event list",
            );
        }
    }
}
