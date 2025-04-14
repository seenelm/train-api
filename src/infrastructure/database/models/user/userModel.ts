import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
    username: string;
    password: string;
    isActive: boolean;
    deviceToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        deviceToken: {
            type: String,
        },
        isActive: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);
