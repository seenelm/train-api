const UserDAO = require("../datastore/UserDAO");
const User = require("../models/user");
const Errors = require("../utils/errors");
const jwtToken = require("../utils/jwtToken");
const bcryptUtil = require("../utils/bcryptUtil");

class AuthService {
  constructor() {
    this.userDAO = new UserDAO(User);
  }

  async registerUser(username, password, name) {
    const existingUser = await this.userDAO.findOneUser(username);
    if (existingUser) {
      let errors = { username: "username already taken" };
      throw new Errors.ConflictError(errors);
    } else {
      const hash = await bcryptUtil.hashPassword(password).catch((error) => {
        console.error(error);
      });
      const newUser = await this.userDAO
        .createUser({
          username,
          password: hash,
          name,
        })
        .catch((error) => {
          // Log Error.
          throw error;
        });

      const payload = {
        name: newUser.name,
        id: newUser._id,
      };

      const token = await jwtToken.sign(payload).catch((error) => {
        console.error(error);
      });

      return { userId: newUser._id, token: token, username: username };
    }
  }

  async loginUser(username, password) {}
}

const authService = new AuthService();
module.exports = authService;
