import { Schema, model, Document, Types } from "mongoose";

export interface UserLibraryExerciseDocument extends Document {
    userId: Types.ObjectId;
    libraryExerciseId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserLibraryExerciseSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
            required: true,
        },
        libraryExerciseId: {
            type: Schema.Types.ObjectId,
            ref: "LibraryExercise",
            required: true,
        },
    },
    { timestamps: true },
);

export const UserLibraryExerciseModel = model<UserLibraryExerciseDocument>(
    "UserLibraryExercise",
    UserLibraryExerciseSchema,
);
