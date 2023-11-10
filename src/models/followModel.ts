import { Schema, model, Types, Document } from "mongoose";
import { IUser } from "./userModel";

interface IFollow extends Document {
    following: Types.DocumentArray<IUser>;
    followers: Types.DocumentArray<IUser>;
}

const followSchema = new Schema({
    following: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const FollowModel = model<IFollow>("Follow", followSchema);

export { FollowModel, IFollow };