import BaseDAO from "./BaseDAO";
import { IFollow } from "../models/followModel";
import { Model, FilterQuery, Types } from "mongoose";
import { IUserProfile } from "../models/userProfile";
import { InternalServerError } from "../utils/errors";

class FollowDAO extends BaseDAO<IFollow> {
    private follow: Model<IFollow>;
  
    constructor(follow: Model<IFollow>) {
        super(follow);
        this.follow = follow;
    }

    public async findOneAndPopulate(query: FilterQuery<IFollow>, path: string): Promise<IFollow | null> {
        return await this.follow.findOne(query)
        .populate({path: path})
        .exec();
    }

    public async getFollowData(
        userId: Types.ObjectId,
    ): Promise<IFollow[] | null> {
        return await this.follow.aggregate([
            { $match: { userId: userId } },
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "following",
                    foreignField: "userId",
                    as: "following",
                },
            },
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "followers",
                    foreignField: "userId",
                    as: "followers",
                },
            },
            {
                $addFields: {
                    followingCount: { $ifNull: [ { $size: "$following" }, 0 ] },
                    followersCount: { $ifNull: [ { $size: "$followers" }, 0 ] },
                },
            },
            {
                $project: {
                    _id: 0,
                    following: {
                        _id: 1,
                        userId: 1,
                        name: 1,
                        username: 1,
                    },
                    followers: {
                        _id: 1,
                        userId: 1,
                        name: 1,
                        username: 1,
                    },
                    followingCount: 1,
                    followersCount: 1,
                },
            },
        ]);
    }


    public async getFollowing(userId: Types.ObjectId): Promise<IUserProfile[]> | null {
        try {
            const following = await this.follow.aggregate([
                {
                    $match: {
                        userId: userId
                    }
                },
                {
                    $lookup: {
                        from: "userprofiles",
                        localField: "following",
                        foreignField: "userId",
                        as: "userFollowing"
                    }
                },
                {
                    $unwind: "$userFollowing"
                },
                {
                    $replaceRoot: { newRoot: "$userFollowing" }
                },
                {
                    $project: {
                        _v: 0
                    }
                }
            ]);
            return following;
        } catch (error) {
            throw new InternalServerError(error.toString());
        }

    }

    public async getFollowers(userId: Types.ObjectId): Promise<IUserProfile[]> | null {
        try {
            const followers = await this.follow.aggregate([
                {
                    $match: {
                        userId: userId
                    }
                },
                {
                    $lookup: {
                        from: "userprofiles",
                        localField: "followers",
                        foreignField: "userId",
                        as: "userFollowers"
                    }
                },
                {
                    $unwind: "$userFollowers"
                },
                {
                    $replaceRoot: { newRoot: "$userFollowers" }
                },
                {
                    $project: {
                        _v: 0
                    }
                }
            ]);

            return followers;
        } catch (error) {
            throw new InternalServerError(error.toString());
        }
    }

}

export default FollowDAO;