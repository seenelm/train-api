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
        imagePath: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: false,
        },
        difficulty: {
            type: String,
            required: false,
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
