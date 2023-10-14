const UserDAO = require("../datastore/UserDAO");
const User = require("../models/user");

class UserService {
  constructor() {
    this.userDAO = new UserDAO(User);
  }

  async isExistingUser(username) {
    const existingUser = await User.findOne({ username: username });
    return existingUser;
  }
}

module.exports = UserService;
