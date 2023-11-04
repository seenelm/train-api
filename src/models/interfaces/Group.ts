import { Document, Types } from "mongoose";
import User from "./User";

interface Request {
    user: Types.ObjectId;
    status: string;
}

export default interface Group extends Document {
    name: string;
    owner: Types.DocumentArray<User>;
    users: Types.DocumentArray<User>;
    requests: Request[];
}