import { Schema, model, Document, Types } from "mongoose";
import { ProgramDifficulty } from "../../../common/enums";

export interface ProgramDocument extends Document {
    name: string;
    description?: string;
    category?: string;
    imagePath?: string;
    createdBy: Types.ObjectId;
    weeks: Types.ObjectId[];
    numWeeks?: number;
    difficulty?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ProgramSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        category: {
            type: String,
            required: false,
        },
        numWeeks: {
            type: Number,
            required: false,
        },
        imagePath: {
            type: String,
            required: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
            required: true,
        },
        weeks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Week",
            },
        ],
        difficulty: {
            type: String,
            enum: Object.values(ProgramDifficulty),
            required: false,
        },
    },
    { timestamps: true },
);

export const ProgramModel = model<ProgramDocument>("Program", ProgramSchema);
