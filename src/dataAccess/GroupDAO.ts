import { IGroup } from "../models/groupModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import { IUserProfile } from "../models/userProfile";

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
}

export default GroupDAO;
