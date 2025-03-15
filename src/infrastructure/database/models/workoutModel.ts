import { Schema, model } from "mongoose";

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

export const WorkoutModel = model("Workout", WorkoutSchema);
