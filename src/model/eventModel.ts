import { Schema, model, Document, Types } from "mongoose";

export interface IEvent extends Document {
    name: string;
    admin: Types.ObjectId[];
    invitees?: Types.ObjectId[];
    startTime: Date;
    endTime?: Date;
    location?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        admin: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "UserProfile",
                },
            ],
            required: true,
        },
        invitees: [
            {
                type: Schema.Types.ObjectId,
                ref: "UserProfile",
            },
        ],
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
    { timestamps: true },
);

export const Event = model<IEvent>("Event", EventSchema);
