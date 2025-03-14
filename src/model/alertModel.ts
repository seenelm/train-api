import { Schema, model, Types, Document } from "mongoose";

export interface IAlert extends Document {
    alerts: Date[];
    isCompleted: boolean;
}

const alertSchema: Schema = new Schema(
    {
        alerts: {
            type: [Date],
            required: true,
        },
        isCompleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true },
);

export const AlertModel = model<IAlert>("Alert", alertSchema);
