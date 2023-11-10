import { Model } from "mongoose";
import { IUser } from "../models/userModel";
import { IGroup } from "../models/groupModel";
import { IUserProfile } from "../models/userProfile";

class SearchDAO {

    private userModel: Model<IUser>;
    private groupModel: Model<IGroup>;
  
    constructor(userModel: Model<IUser>, groupModel: Model<IGroup>) {
        this.userModel = userModel;
        this.groupModel = groupModel;
    }

    public async search(query: string | object): Promise<(IUser & IUserProfile & IGroup)[] | null> {
        const users = await this.userModel.aggregate([
            {
                $lookup: {
                    from: 'userprofiles',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'profile',
                },
            },
            {
                $unwind: {
                    path: '$profile',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $match: {
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { 'profile.name': { $regex: query, $options: 'i' } },
                      ],
                },
            },
            {
                $project: {
                    username: 1,
                    name: '$profile.name',
                },
            },
        ]);

        const groups = await this.groupModel.find({
            name: { $regex: query, $options: 'i' } 
        }).select('name');

        return users.concat(groups);
    }
}

export default SearchDAO;