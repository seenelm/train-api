import { IUser } from "../models/userModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import { IGroup } from "../models/groupModel";
import { IUserProfile } from "../models/userProfile";
import { IUserGroups } from "../models/userGroups";

class UserDAO extends BaseDAO<IUser> {

  private userModel: Model<IUser>;
  
  constructor(userModel: Model<IUser>) {
    super(userModel);
    this.userModel = userModel;
  }

  public async findUserById(userId: Types.ObjectId, field: string): Promise<IUser | null> {
    return await this.userModel.findById(userId)
    .select(field)
    .exec();
  }

  public async fetchUserData(userId: Types.ObjectId): Promise<(IUser & IUserProfile & IUserGroups)[] | null> {

    const userData = await this.userModel.aggregate([
      {
        $match: {
          _id: userId
        }
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "userProfile"
        }
      },
      {
        $lookup: {
          from: "usergroups",
          localField: "_id",
          foreignField: "userId",
          as: "userGroups"
        }
      },
      {
        $project: {
          username: 1,
          userProfile: 1,
          userGroups: 1
        }
      }
    ]);

    return userData;
  }
}

export default UserDAO;
