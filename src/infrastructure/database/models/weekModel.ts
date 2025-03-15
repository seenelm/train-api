import { Schema, model, Document, Types } from "mongoose";
export interface WeekDocument extends Document {
    programId: Types.ObjectId;
    name: string;
    description?: string;
    imagePath?: string;
    weekNumber: number;
    workouts: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const WeekSchema: Schema = new Schema(
    {
        programId: {
            type: Schema.Types.ObjectId,
            ref: "Program",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        imagePath: {
            type: String,
            required: false,
        },
        weekNumber: {
            type: Number,
            required: true,
        },
        workouts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Workout",
            },
        ],
    },
    { timestamps: true },
);

export const WeekModel = model<WeekDocument>("Week", WeekSchema);
