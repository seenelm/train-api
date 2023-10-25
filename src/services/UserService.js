import UserDAO from "../datastore/UserDAO.js";
import UserModel from "../models/userModel.js";

class UserService {
  constructor() {
    this.userDAO = new UserDAO(UserModel);
  }

  async isExistingUser(username) {
    const existingUser = await UserModel.findOne({ username: username });
    return existingUser;
  }
}

export default UserService;
