import { Types } from "mongoose";
import { EventStatus } from "../../src/common/constants";
import { IUserEvent } from "../../src/model/userEventModel";

export const userEventMockData: IUserEvent[] = [
    {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        events: [
            {
                eventId: new Types.ObjectId(),
                status: EventStatus.Accepted,
            },
            {
                eventId: new Types.ObjectId(),
                status: EventStatus.Pending,
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    } as IUserEvent,
    {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        events: [
            {
                eventId: new Types.ObjectId(),
                status: EventStatus.Rejected,
            },
            {
                eventId: new Types.ObjectId(),
                status: EventStatus.Accepted,
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    } as IUserEvent,
    {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        events: [
            {
                eventId: new Types.ObjectId(),
                status: EventStatus.Pending,
            },
            {
                eventId: new Types.ObjectId(),
                status: EventStatus.Pending,
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    } as IUserEvent,
];
