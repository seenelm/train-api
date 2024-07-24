import BaseDAO from "./BaseDAO";
import { IUserGroups } from "../models/userGroups";
import { Model, FilterQuery } from "mongoose";
import { ObjectId } from "mongodb";
import { UserGroupsResponse, GroupResponse } from "../dtos/response/userProfileResponse";

class UserGroupsDAO extends BaseDAO<IUserGroups> {
    private userGroups: Model<IUserGroups>;

    constructor(userGroups: Model<IUserGroups>) {
        super(userGroups);
        this.userGroups = userGroups;
    }

    public async findOneAndPopulate(
        query: FilterQuery<IUserGroups>,
        path: string,
    ): Promise<IUserGroups | null> {
        const userGroups = await this.userGroups
            .findOne(query)
            .populate({ path: path })
            .exec();

            console.log("GROUPS: ", userGroups);

        return userGroups;
    }

    public async findUserGroups(userId: ObjectId): Promise<GroupResponse[]> {
        const userGroups = await this.userGroups.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groups",
                    foreignField: "_id",
                    as: "groups",
                },
            },
            {
                $unwind: "$groups",
            },
            {
                $replaceRoot: { newRoot: "$groups" },
            },
        ]).exec();

        return userGroups;
    }
}

export default UserGroupsDAO;
