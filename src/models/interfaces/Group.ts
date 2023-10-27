import { Types, Document } from "mongoose";

interface Request {
    user: Types.ObjectId;
    status: string;
}

export default interface Group extends Document {
    name: string;
    owner: Types.ObjectId;
    users: Types.ObjectId[];
    requests: Request[];
}