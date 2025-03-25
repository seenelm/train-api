import { Schema, model, Document, Types } from "mongoose";

export interface CategoryDocument extends Document {
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const CategoryModel = model<CategoryDocument>(
    "Category",
    CategorySchema,
);
