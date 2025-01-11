import EventDAO from "../dao/EventDAO";
import UserEventDAO from "../dao/UserEventDAO";
import { CreateEventRequest } from "../dto/CreateEventRequest";
import { CreateEventResponse } from "../dto/CreateEventResponse";
import { IEvent } from "../model/eventModel";
import { ObjectId } from "mongodb";
import { InternalServerError, handleDatabaseError } from "../utils/errors";
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

    /**
     *
     * @param createEventRequest
     * @returns CreateEventResponse
     */
    public async addEvent(
        createEventRequest: CreateEventRequest,
    ): Promise<CreateEventResponse> {
        const session = await mongoose.startSession();
        console.debug("Session started: ", session.id);
        session.startTransaction();
        console.debug("Transaction started for session: ", session.id);

        try {
            // Check if event already exists
            const event: IEvent = await this.eventDAO.create(
                createEventRequest,
                { session },
            );
            console.debug("Event created: ", event);

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
            console.debug("Transaction committed for session: ", session.id);
            return CreateEventResponse.from(event);
        } catch (error) {
            console.error("Error during transaction, aborting: ", error);
            await session.abortTransaction();
            console.debug("Transaction aborted for session: ", session.id);
            throw handleDatabaseError(error);
        } finally {
            session.endSession();
            console.debug("Session ended: ", session.id);
        }
    }

    /**
     *
     * @param userId
     * @param eventId
     * @returns all user events
     */
    public async getUserEvents(userId: ObjectId): Promise<UserEventResponse[]> {
        try {
            // add local cache for events
            // if user doesn't have any of the events in cache, fetch all events for the user
            // if user has some events in cache, fetch only the events not in cache
            // if event is updated or deleted, update the cache and return the updated events
            const userEventEntityList: UserEventEntity[] =
                await this.userEventDAO.getUserEvents(userId);

            if (!userEventEntityList) {
                throw new ResourceNotFoundError("Event not found");
            }

            return UserEventResponse.from(userEventEntityList);
        } catch (error) {
            throw handleDatabaseError(error);
        }
    }

    private async upsertAdminEvents(
        admins: ObjectId[],
        event: IEvent,
        session: mongoose.ClientSession,
    ): Promise<void> {
        console.debug("Starting to upsert admin events for event: ", event._id);

        const promises = admins.map(async (admin) => {
            console.debug("Upserting event for admin: ", admin);
            await this.userEventDAO.findOneAndUpdate(
                { userId: admin },
                { $push: { events: { eventId: event._id } } },
                { upsert: true, session },
            );
            console.debug("Successfully upserted event for admin: ", admin);
        });
        await Promise.all(promises);
    }

    private async upsertInviteeEvents(
        invitees: ObjectId[],
        event: IEvent,
        session: mongoose.ClientSession,
    ): Promise<void> {
        console.debug(
            "Starting to upsert invitee events for event: ",
            event._id,
        );

        const promises = invitees.map(async (invitee) => {
            console.debug("Upserting event for invitee: ", invitee);
            await this.userEventDAO.findOneAndUpdate(
                { userId: invitee },
                { $push: { events: { eventId: event._id } } },
                { upsert: true, session },
            );
            console.debug("Successfully upserted event for invitee: ", invitee);
        });
        await Promise.all(promises);
    }
}
