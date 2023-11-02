import { Types, Document } from "mongoose";
import Group from "./Group";

export default interface User extends Document {
    name: string;
    username: string;
    password: string;
    groups?: Types.DocumentArray<Group>;
    following: Types.ObjectId[];
    followers: Types.ObjectId[];
}