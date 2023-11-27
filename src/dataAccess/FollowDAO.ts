import BaseDAO from "./BaseDAO";
import { IFollow } from "../models/followModel";
import { Model, FilterQuery, Types } from "mongoose";
import { IUser } from "../models/userModel";
import { IUserProfile } from "../models/userProfile";

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

    public async getFollowing(userId: Types.ObjectId): Promise<IUserProfile[]> | null {
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
                $project: {
                    userFollowing: 1,
                }
            }
        ]);

        return following;
    }

}

export default FollowDAO;