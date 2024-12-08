import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  isActive: boolean;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true
  }
});

const UserModel = model<IUser>("User", userSchema);

export { UserModel, IUser };
