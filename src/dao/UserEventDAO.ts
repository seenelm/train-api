import BaseDAO from "./BaseDAO";
import { IUserEvent } from "../model/userEventModel";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { UserEventEntity } from "../entity/UserEventEntity";

export default class UserEventDAO extends BaseDAO<IUserEvent> {
    private userEvent: Model<IUserEvent>;

    constructor(userEvent: Model<IUserEvent>) {
        super(userEvent);
        this.userEvent = userEvent;
    }

    /**
     *
     * @param userId
     * @returns all user events
     */
    public async getUserEvents(userId: ObjectId): Promise<UserEventEntity[]> {
        const userEvents = await this.userEvent.aggregate([
            {
                $match: {
                    userId,
                },
            },
            {
                $unwind: "$events",
            },
            {
                $lookup: {
                    from: "events",
                    localField: "events.eventId",
                    foreignField: "_id",
                    as: "event",
                },
            },
            {
                $unwind: "$event",
            },
            {
                $project: {
                    _id: 0,
                    status: "$events.status",
                    event: 1,
                },
            },
        ]);

        return userEvents.map(
            (userEvent) =>
                new UserEventEntity(userEvent.status, userEvent.event),
        );
    }
}
