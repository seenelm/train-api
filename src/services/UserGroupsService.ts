import * as Errors from "../utils/errors";
import { Types } from "mongoose";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel, IUserGroups } from "../models/userGroups";
import { logger } from "../common/logger";

class UserGroupsService {
  private userGroupsDAO: UserGroupsDAO;

  constructor(userGroupsDAO: UserGroupsDAO) {
    // this.userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
    this.userGroupsDAO = userGroupsDAO;
  }

  public async fetchUserGroups(userId: Types.ObjectId) {
    const user = await this.userGroupsDAO.findOneUser({ userId }, "groups");
    const userGroups = user.groups;

    console.log("UserGroups: ", userGroups);

    if (!user) {
      throw new Errors.ResourceNotFoundError("User not found");
    }

    logger.info(`User "${userId}" Groups: `, userGroups);

    return { userGroups };
  }
}

export default UserGroupsService;
