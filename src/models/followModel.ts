import { Schema, model, Types, Document } from "mongoose";
import { IUser } from "./userModel";

interface IFollow extends Document {
    userId: Types.ObjectId;
    following: Types.ObjectId[];
    followers: Types.ObjectId[];
    requests: Types.ObjectId[];
}

const followSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: [
        {
          type: Schema.Types.ObjectId,
          ref: "UserProfile",
        },
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
        },
    ],
    requests: [
        {
          type: Schema.Types.ObjectId,
          ref: "UserProfile",
        },
    ],
});

const FollowModel = model<IFollow>("Follow", followSchema);

export { FollowModel, IFollow };