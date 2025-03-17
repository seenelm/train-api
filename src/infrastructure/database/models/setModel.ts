import { Schema, model, Document, Types } from "mongoose";

export interface SetDocument extends Document {
    weight?: number;
    reps?: number;
    completed?: boolean;
    imagePath?: string;
    link?: string;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const SetSchema: Schema = new Schema(
    {
        weight: {
            type: Number,
            required: false,
        },
        reps: {
            type: Number,
            required: false,
        },
        completed: {
            type: Boolean,
            required: false,
        },
        imagePath: {
            type: String,
            required: false,
        },
        link: {
            type: String,
            required: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
            required: true,
        },
    },
    { timestamps: true },
);

export const SetModel = model<SetDocument>("Set", SetSchema);
