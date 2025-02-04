import { Schema, model, Types, Document } from "mongoose";
import { EventStatus } from "../common/enums";

interface IEvent {
    eventId: Types.ObjectId;
    status: EventStatus;
}

export interface IUserEvent extends Document {
    userId: Types.ObjectId;
    events: IEvent[];
    createdAt: Date;
    updatedAt: Date;
}

const userEventSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "UserProifle",
            required: true,
        },
        events: [
            {
                eventId: {
                    type: Schema.Types.ObjectId,
                    ref: "Event",
                },
                status: {
                    type: Number,
                    enum: [
                        EventStatus.Accepted,
                        EventStatus.Rejected,
                        EventStatus.Pending,
                    ],
                    default: EventStatus.Pending,
                },
            },
        ],
    },
    { timestamps: true },
);

export const UserEvent = model<IUserEvent>("UserEvent", userEventSchema);
