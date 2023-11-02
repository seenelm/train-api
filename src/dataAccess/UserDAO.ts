import User from "../models/interfaces/User";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import Group from "../models/interfaces/Group";

class UserDAO extends BaseDAO<User> {

  private userModel: Model<User>;
  
  constructor(userModel: Model<User>) {
    super(userModel);
    this.userModel = userModel;
  }

  public async findUserById(id: Types.ObjectId | string, path: string): Promise<User | null> {
    return await this.userModel.findById(id)
    .populate<{group: Group}>({path: path})
    .exec();
  }
  
  
}

export default UserDAO;
