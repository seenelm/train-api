import { IUser } from "../models/userModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import { IGroup } from "../models/groupModel";

class UserDAO extends BaseDAO<IUser> {

  private userModel: Model<IUser>;
  
  constructor(userModel: Model<IUser>) {
    super(userModel);
    this.userModel = userModel;
  }

  public async findUserById(id: Types.ObjectId | string, path: string): Promise<IUser | null> {
    return await this.userModel.findById(id)
    .populate<{group: IGroup}>({path: path})
    .exec();
  }
}

export default UserDAO;
