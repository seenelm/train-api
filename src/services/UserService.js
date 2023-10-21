import UserDAO from "../datastore/UserDAO.js";
import User from "../models/user.js";

class UserService {
  constructor() {
    this.userDAO = new UserDAO(User);
  }

  async isExistingUser(username) {
    const existingUser = await User.findOne({ username: username });
    return existingUser;
  }
}

export default UserService;
