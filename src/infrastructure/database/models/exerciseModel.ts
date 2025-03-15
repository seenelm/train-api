import { Schema, model } from "mongoose";

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

export const ExerciseModel = model("Exercise", ExerciseSchema);
