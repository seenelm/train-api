import { Schema, model } from "mongoose";

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

export const SetModel = model("Set", SetSchema);
