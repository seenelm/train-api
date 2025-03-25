import { Schema, model, Document, Types } from "mongoose";

export interface MuscleDocument extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const MuscleSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const MuscleModel = model<MuscleDocument>("Muscle", MuscleSchema);
