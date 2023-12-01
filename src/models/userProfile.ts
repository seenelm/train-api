import { Schema, model, Types, Document } from "mongoose";
import { ProfileAccess } from "../common/constants";
import { number } from "joi";

interface IUserProfile extends Document {
    userId: Types.ObjectId;
    username: string;
    name: string;
    bio: string;
    accountType: number;
}

const userProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String
    },
    accountType: {
        type: number,
        enum: [ProfileAccess.Public, ProfileAccess.Private],
        default: ProfileAccess.Public
    }
});

const UserProfileModel = model<IUserProfile>("UserProfile", userProfileSchema);

export { UserProfileModel, IUserProfile };