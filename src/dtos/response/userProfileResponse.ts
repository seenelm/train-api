import { ObjectId } from "mongodb";

export interface GroupResponse {
    _id: ObjectId;
    groupName: string;
    bio: string;
    owners: ObjectId[];
    users: ObjectId[];
    requests: ObjectId[];
    accountType: number;
}
  
export interface UserGroupsResponse {
    userId: ObjectId;
    groups: GroupResponse[];
}