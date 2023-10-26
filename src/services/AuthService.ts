import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors.js";
import jwtToken from "../utils/jwtToken.js";
import BcryptUtil from "../utils/BcryptUtil";

class AuthService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  public async registerUser(username: string, password: string, name: string) {
    const existingUser = await this.userDAO.findOne({ username: username });
    if (existingUser) {
      let errors = { username: "username already taken" };
      throw new Errors.ConflictError("Conflict Error", errors);
    } else {
      const hash = await BcryptUtil.hashPassword(password).catch((error) => {
        console.error(error);
      });
      const newUser = await this.userDAO
        .create({
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

  public async loginUser(username: string, password: string) {}
}

export default new AuthService();
