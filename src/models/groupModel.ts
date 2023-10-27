import { Schema, model } from "mongoose";
import Group from "./interfaces/Group";

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  requests: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        default: "pending",
      },
    },
  ],
});

const GroupModel = model<Group>("Group", groupSchema);

export default GroupModel;
