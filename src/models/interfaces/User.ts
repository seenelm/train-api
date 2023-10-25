import { Types, Document } from "mongoose";

export default interface User extends Document {
    name: string;
    username: string;
    password: string;
    groups: Types.ObjectId[];
    following: Types.ObjectId[];
    followers: Types.ObjectId[];
}