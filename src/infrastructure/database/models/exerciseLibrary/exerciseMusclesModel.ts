import { Schema, model, Document, Types } from "mongoose";

export interface ExerciseMusclesDocument extends Document {
    exerciseId: Types.ObjectId;
    muscleId: Types.ObjectId;
    primary: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ExerciseMusclesSchema: Schema = new Schema(
    {
        exerciseId: {
            type: Schema.Types.ObjectId,
            ref: "Exercise",
            required: true,
        },
        muscleId: {
            type: Schema.Types.ObjectId,
            ref: "Muscle",
            required: true,
        },
        primary: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true },
);

export const ExerciseMusclesModel = model<ExerciseMusclesDocument>(
    "ExerciseMuscles",
    ExerciseMusclesSchema,
);
