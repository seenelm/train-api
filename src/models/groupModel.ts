import { Schema, model, Types, Document } from "mongoose";
import { IUser } from "./userModel";

interface IGroup extends Document {
  name: string;
  bio: string;
  owners: Types.DocumentArray<IUser>;
  users: Types.DocumentArray<IUser>;
  requests: Types.DocumentArray<IUser>;
}

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String
  },
  owners: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
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
      ref: "User",
    },
  ],
});

const GroupModel = model<IGroup>("Group", groupSchema);

export { GroupModel, IGroup };
