import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import { UserModel, User } from "../models/userModel";
import { Types } from "mongoose";

class UserService {
  private userDAO: UserDAO;
  private userInstance: User;

  constructor() {
    this.userDAO = new UserDAO(UserModel);
    this.userInstance = new User(null);
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

  public async findUsers(query: any) {
    const users = await this.userDAO.searchUsers(query);
    
    if (!users) {
      throw new Errors.BadRequestError("User does not exist");
    }

    const usersList = users.map((user) => ({
      username: user.username,
      name: user.name,
    }));

    return { usersList };
    
  }

  public async updateUserBio(userId: Types.ObjectId | string, userBio: string): Promise<void> {
    
    if (userBio === null) {
      throw new Errors.BadRequestError("Invalid User Bio");
    }

    const user = await this.userDAO.findById(userId);

    if (!user) {
      throw new Errors.ResourceNotFoundError("User does not exist");
    }

    this.userInstance.user = user;
    await this.userInstance.setBio(userBio);
  }

}

export default new UserService();
