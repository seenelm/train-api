import * as Errors from "../utils/errors";
import { Types } from "mongoose";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";

class UserGroupsService {
  private userGroupsDAO: UserGroupsDAO;

  constructor() {
    this.userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
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

}

export default UserGroupsService;
