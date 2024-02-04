import { Model } from "mongoose";
import { IUser } from "../models/userModel";
import { IGroup } from "../models/groupModel";
import { IUserProfile } from "../models/userProfile";
import { Types } from "mongoose";

class SearchDAO {
  private userModel: Model<IUser>;
  private groupModel: Model<IGroup>;

  constructor(userModel: Model<IUser>, groupModel: Model<IGroup>) {
    this.userModel = userModel;
    this.groupModel = groupModel;
  }

  /**
   *
   * @param query search term
   * @returns array of users (userId, username, name) and groups (groupId, group name)
   */
  public async search(
    query: string | object,
    userId: Types.ObjectId
  ): Promise<(IUser & IUserProfile & IGroup)[] | null> {
    const users = await this.userModel.aggregate([
      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { "profile.name": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          username: 1,
          name: "$profile.name",
        },
      },
    ]);

    const groups = await this.groupModel.aggregate([
      {
        $match: {
          groupName: { $regex: query, $options: "i" },
        },
      },
      {
        $addFields: {
          isMember: {
            $or: [
              {
                $in: [userId, "$users"],
              },
              {
                $in: [userId, "$owners"],
              },
            ],
          },
        },
      },
      {
        $project: {
          groupName: 1,
          isMember: 1,
          accountType: 1,
        },
      },
    ]);

    return users.concat(groups);
  }
}

export default SearchDAO;
