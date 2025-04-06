import { Schema, model, Document, Types } from "mongoose";

export interface ExerciseDocument extends Document {
    name?: string;
    group?: string; // rename to category
    imagePath?: string;
    weight?: string;
    targetSets?: number;
    targetReps?: number;
    notes?: string;
    completed?: boolean;
    createdBy: Types.ObjectId;
    sets: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const ExerciseSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        group: {
            type: String,
            required: false,
        },
        imagePath: {
            type: String,
            required: false,
        },
        weight: {
            type: String,
            required: false,
        },
        targetSets: {
            type: Number,
            required: false,
        },
        targetReps: {
            type: Number,
            required: false,
        },
        notes: {
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
        sets: [
            {
                type: Schema.Types.ObjectId,
                ref: "sets",
            },
        ],
    },
    { timestamps: true },
);

export const ExerciseModel = model<ExerciseDocument>(
    "Exercise",
    ExerciseSchema,
);
