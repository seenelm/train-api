import { Schema, model, Types, Document } from "mongoose";
import Group from "./interfaces/Group";

interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  bio?: string;
  groups?: Types.DocumentArray<Group>;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: Schema.Types.String
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
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

const UserModel = model<IUser>("User", userSchema);

class User {
  public user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  public async setBio(bio: string) {
    this.user.bio = bio;
    await this.user.save();
  }

  public getBio(): string {
    return this.user.bio;
  }
}

export { UserModel, User, IUser };
