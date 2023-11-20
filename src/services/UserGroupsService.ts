import * as Errors from "../utils/errors";
import { Types } from "mongoose";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";

class UserGroupsService {
  private userGroupsDAO: UserGroupsDAO;

  constructor() {
    this.userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
  }

  public async fetchUserGroups(userId: Types.ObjectId | string) {
    const user = await this.userGroupsDAO.findOneUser({ userId }, "groups");
    const userGroups = user.groups;

    if (!user) {
      throw new Errors.ResourceNotFoundError("User not found");
    }
    
    // Filter out requests array.

    return { userGroups };
  }

}

export default UserGroupsService;
