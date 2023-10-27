import UserModel from "../models/userModel";
import User from "../models/interfaces/User";
import BaseDAO from "./BaseDAO";

class UserDAO extends BaseDAO<User> {
  
  constructor() {
    super(UserModel);
  }
  // constructor(UserModel) {
  //   this.User = UserModel;
  // }

  // async createUser(userData) {
  //   const user = await this.User.create(userData).catch((error) => {
  //     throw new Errors.InternalServerError(error);
  //   });
  //   return user;
  // }

  // async findOneUser(username) {
  //   const user = await this.User.findOne({ username: username });
  //   if (!user) {
  //     throw new Errors.ResourceNotFoundError("User not found");
  //   }
  //   return user;
  // }

  // async findUserById(userId) {
  //   const user = await this.User.findById(userId).catch((error) => {
  //     throw new Errors.ResourceNotFoundError(error);
  //   });
  //   return user;
  // }
}

export default UserDAO;
