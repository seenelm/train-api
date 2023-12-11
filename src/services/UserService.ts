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

  public async findUsers(query: string | object) {
    if (typeof query === 'string' && (!query || query.trim() === "")) {
      throw new Errors.BadRequestError("Invalid query string");
    }

    if (typeof query === "object" && (!query || Object.keys(query).length === 0)) {
      throw new Errors.BadRequestError("Invalid query object");
    }

    const users = await this.userDAO.searchUsers(query);
    console.log("Users: ", users);
    if (!users) {
      throw new Errors.ResourceNotFoundError("User does not exist");
    }

    const usersList = users.map((user) => ({
      username: user.username,
      name: user.name,
    }));
    console.log("usersList: ", usersList);
    
    return { usersList };
    
  }

  public async updateUserBio(userId: Types.ObjectId | string, userBio: string | null): Promise<void> {
    
    if (!userBio) {
      throw new Errors.BadRequestError("Users Bio is Undefined");
    }

    const user = await this.userDAO.findById(userId);

    if (!user) {
      throw new Errors.ResourceNotFoundError("User does not exist");
    }

    this.userInstance.user = user;
    await this.userInstance.setBio(userBio);
  }

  public async updateUsersFullName(userId: Types.ObjectId | string, name: string | null): Promise<void> {
    
    if (!name) {
      throw new Errors.BadRequestError("Users Name is Undefined");
    }

    const user = await this.userDAO.findById(userId);

    if (!user) {
      throw new Errors.ResourceNotFoundError("User does not exist");
    }

    this.userInstance.user = user;
    await this.userInstance.setName(name);
  }

}

export default UserService;
