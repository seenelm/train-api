import { Schema, model, Document, Types } from "mongoose";

export interface LibraryExerciseDocument extends Document {
    name: string;
    imagePath?: string;
    description?: string;
    categoryId?: Types.ObjectId;
    difficulty?: string;
    equipment?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const LibraryExerciseSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
        },
        equipment: [
            {
                type: String,
                required: false,
            },
        ],
    },
    { timestamps: true },
);

export const LibraryExerciseModel = model<LibraryExerciseDocument>(
    "LibraryExercise",
    LibraryExerciseSchema,
);
