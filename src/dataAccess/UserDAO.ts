import { IUser } from "../models/userModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import Group from "../models/interfaces/Group";

class UserDAO extends BaseDAO<IUser> {

  private userModel: Model<IUser>;
  
  constructor(userModel: Model<IUser>) {
    super(userModel);
    this.userModel = userModel;
  }

  public async findUserById(id: Types.ObjectId | string, path: string): Promise<IUser | null> {
    return await this.userModel.findById(id)
    .populate<{group: Group}>({path: path})
    .exec();
  }

  public async searchUsers(query: string): Promise<IUser[] | null> {
    return await this.userModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).exec();
  }
  
  
}

export default UserDAO;
