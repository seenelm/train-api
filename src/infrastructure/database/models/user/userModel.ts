import { required } from "joi";
import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
    uid: string;
    email?: string;
    username: string;
    password: string;
    isActive: boolean;
    deviceToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        deviceToken: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);
