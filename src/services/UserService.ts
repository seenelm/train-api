import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import UserModel from "../models/userModel";
import { Types } from "mongoose";

class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO(UserModel);
  }

  public async fetchGroups(userId: Types.ObjectId | string) {
    const user = await this.userDAO.findUserById(userId, "groups");

    if (!user) {
      throw new Errors.ResourceNotFoundError("User not found");
    }
    
    const userGroups = user.groups.map((group) => ({
      id: group._id,
      name: group.name
    }));

    return { userGroups };
  }

}

export default new UserService();
