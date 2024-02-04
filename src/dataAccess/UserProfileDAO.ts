import BaseDAO from "./BaseDAO";
import { IUserProfile } from "../models/userProfile";
import { IUserGroups } from "../models/userGroups";
import { IFollow } from "../models/followModel";
import { IGroup } from "../models/groupModel";
import { Model, Types } from "mongoose";

class UserProfileDAO extends BaseDAO<IUserProfile> {
    private userProfile: Model<IUserProfile>;

    constructor(userProfile: Model<IUserProfile>) {
        super(userProfile);
        this.userProfile = userProfile;
    }

    public async fetchUserData(
        userId: Types.ObjectId | string,
    ): Promise<(IUserProfile & IGroup & IFollow)[] | null> {
        const userData = await this.userProfile.aggregate([
            {
                $match: {
                    _id: userId,
                },
            },
            {
                $lookup: {
                    from: "usergroups",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userGroups",
                },
            },
            {
                $unwind: "userGroups.groups",
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "userGroups.groups",
                    foreignField: "_id",
                    as: "groups",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "userId",
                    as: "followData",
                },
            },
            {
                $addFields: {
                    following: "$followData.following",
                    followers: "$followData.followers",
                },
            },
            {
                $project: {
                    followData: 0,
                    userGroups: 0,
                },
            },
        ]);
        return userData;
    }
}

export default UserProfileDAO;
