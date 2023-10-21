import UserDAO from "../datastore/UserDAO.js";
import User from "../models/user.js";
import * as Errors from "../utils/errors.js";
import jwtToken from "../utils/jwtToken.js";
import bcryptUtil from "../utils/bcryptUtil.js";

class AuthService {
  constructor() {
    this.userDAO = new UserDAO(User);
  }

  async registerUser(username, password, name) {
    const existingUser = await this.userDAO.findOneUser(username);
    if (existingUser) {
      let errors = { username: "username already taken" };
      throw new Errors.ConflictError("Conflict Error", errors);
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

export default new AuthService();
