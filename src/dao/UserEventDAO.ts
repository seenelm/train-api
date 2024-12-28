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

    public async findUserEvent(
        userId: ObjectId,
        eventId: ObjectId,
    ): Promise<UserEventEntity> {
        const event = await this.userEvent.aggregate([
            {
                $match: {
                    userId: userId,
                    "events.eventId": eventId,
                },
            },
            {
                $unwind: "$event",
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
                    _id: 1,
                    userId: 1,
                    "event.status": 1,
                    event: 1,
                },
            },
        ]);

        return new UserEventEntity(
            event[0].userId,
            event[0].events.status,
            event[0].event,
        );
    }
}
