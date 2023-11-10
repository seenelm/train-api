import { Schema, model, Types, Document } from "mongoose";
import { IGroup } from "./groupModel";

interface IUserGroups extends Document {
    userId: Types.ObjectId;
    groups: Types.DocumentArray<IGroup>;
}

const userGroupsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: "Group",
        },
    ],
});

const UserGroupsModel = model<IUserGroups>("UserGroups", userGroupsSchema);

export { UserGroupsModel, IUserGroups };