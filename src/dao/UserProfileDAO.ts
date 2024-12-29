import BaseDAO from "./BaseDAO";
import { IUserProfile } from "../model/userProfile";
import { IUserGroups } from "../model/userGroups";
import { IFollow } from "../model/followModel";
import { IGroup } from "../model/groupModel";
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
