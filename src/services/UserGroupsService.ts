import * as Errors from "../utils/errors";
import { Types } from "mongoose";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import UserDAO from "../dataAccess/UserDAO";
import { UserModel } from "../models/userModel";

class UserGroupsService {
  private userGroupsDAO: UserGroupsDAO;
  // private userDAO: UserDAO;

  constructor() {
    this.userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
    // this.userDAO = new UserDAO(UserModel);
  }

  public async fetchGroups(userId: Types.ObjectId | string) {
    const user = await this.userGroupsDAO.findOneUser({ userId }, "groups");

    if (!user) {
      throw new Errors.ResourceNotFoundError("User not found");
    }
    
    const userGroups = user.groups.map((group) => ({
      id: group._id,
      name: group.name
    }));

    return { userGroups };
  }

  // public async findUsers(query: string | object) {
  //   if (typeof query === 'string' && (!query || query.trim() === "")) {
  //     throw new Errors.BadRequestError("Invalid query string");
  //   }

  //   if (typeof query === "object" && (!query || Object.keys(query).length === 0)) {
  //     throw new Errors.BadRequestError("Invalid query object");
  //   }

  //   const users = await this.userDAO.searchUsers(query);
  //   if (!users) {
  //     throw new Errors.ResourceNotFoundError("User does not exist");
  //   }

  //   const usersList = users.map((user) => ({
  //     username: user.username,
  //     name: user.name,
  //   }));

  //   return { usersList };
    
  // }

}

export default UserGroupsService;
