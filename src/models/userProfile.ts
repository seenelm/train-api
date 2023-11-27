import { Schema, model, Types, Document } from "mongoose";
import { ProfileAccess } from "../common/constants";

interface IUserProfile extends Document {
    userId: Types.ObjectId;
    name: string;
    bio: string;
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
        type: String,
        enum: [ProfileAccess.Public, ProfileAccess.Private],
        default: ProfileAccess.Public
    }
});

const UserProfileModel = model<IUserProfile>("UserProfile", userProfileSchema);

export { UserProfileModel, IUserProfile };