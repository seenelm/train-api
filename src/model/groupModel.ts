import { Schema, model, Types, Document } from "mongoose";
import { ProfileAccess } from "../common/enums";

interface IGroup extends Document {
    groupName: string;
    bio: string;
    owners: Types.ObjectId[];
    users: Types.ObjectId[];
    requests: Types.ObjectId[];
    accountType: number;
}

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },

    owners: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
        },
    ],
    accountType: {
        type: Number,
        enum: [ProfileAccess.Public, ProfileAccess.Private],
        default: ProfileAccess.Public,
    },
});

const GroupModel = model<IGroup>("Group", groupSchema);

export { GroupModel, IGroup };
