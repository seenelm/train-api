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
    type: Schema.Types.String
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

class Group {
  public group: IGroup;

  constructor(group: IGroup) {
    this.group = group;
  }

  public async setBio(bio: string) {
    console.log("Group Bio: ", bio);
    this.group.bio = bio;
    await this.group.save();
  }

  public getBio(): string {
    return this.group.bio;
  }

  public async setName(name: string) {
    this.group.name = name;
    await this.group.save();
  }

  public getName(): string {
    return this.group.name;
  }
}

export { GroupModel, IGroup, Group };
