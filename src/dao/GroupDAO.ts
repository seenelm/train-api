import { IGroup } from "../model/groupModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import { IUserProfile } from "../model/userProfile";

class GroupDAO extends BaseDAO<IGroup> {
    private groupModel: Model<IGroup>;

    constructor(groupModel: Model<IGroup>) {
        super(groupModel);
        this.groupModel = groupModel;
    }

    public async findGroupById(
        groupId: Types.ObjectId,
        field: string,
    ): Promise<IGroup | null> {
        return await this.groupModel.findById(groupId).select(field).exec();
    }

    public async getJoinRequests(
        groupId: Types.ObjectId,
    ): Promise<IUserProfile[] | null> {
        return await this.groupModel.aggregate([
            {
                $match: {
                    _id: groupId,
                },
            },
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "requests",
                    foreignField: "userId",
                    as: "joinRequests",
                },
            },
            {
                $unwind: "$joinRequests",
            },
            {
                $replaceRoot: { newRoot: "$joinRequests" },
            },
        ]);
    }

    public async getJoinRequestsByUser(
        userId: Types.ObjectId,
    ): Promise<any[] | null> {
        // Return type changed to any[] as it now includes group information
        return await this.groupModel.aggregate([
            {
                $match: {
                    owners: userId,
                },
            },
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "requests",
                    foreignField: "userId",
                    as: "joinRequests",
                },
            },
            {
                $unwind: "$joinRequests",
            },
            {
                $group: {
                    _id: "$_id", // Group by groupId
                    groupName: { $first: "$groupName" }, // Collect groupName
                    joinRequests: { $push: "$joinRequests" }, // Collect all join requests for this group
                },
            },
            {
                $project: {
                    _id: 0,
                    groupId: "$_id",
                    groupName: 1,
                    joinRequests: 1,
                },
            },
        ]);
    }
}

export default GroupDAO;
