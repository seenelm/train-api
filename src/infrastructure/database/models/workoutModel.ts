import { Schema, model, Document, Types } from "mongoose";

export interface WorkoutDocument extends Document {
    title?: string;
    description?: string;
    imagePath?: string;
    completed?: boolean;
    createdBy: Types.ObjectId;
    exercises: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const WorkoutSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        imagePath: {
            type: String,
            required: false,
        },
        completed: {
            type: Boolean,
            required: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
            required: true,
        },
        exercises: [
            {
                type: Schema.Types.ObjectId,
                ref: "exercise",
            },
        ],
    },
    { timestamps: true },
);

export const WorkoutModel = model<WorkoutDocument>("Workout", WorkoutSchema);
