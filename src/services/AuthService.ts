import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import JWTUtil from "../utils/JWTUtil";
import BcryptUtil from "../utils/BcryptUtil";
import { UserModel } from "../models/userModel";

class AuthService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO(UserModel);
  }

  public async registerUser(username: string, password: string, name: string) {
    // Refactor

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

      const token = await JWTUtil.sign(payload, process.env.SECRET_CODE).catch((error) => {
        console.error(error);
      });

      return { userId: newUser._id, token: token, username: username };
    }
  }

  public async loginUser(username: string, password: string) {
    let errors = {};
    
    // Refactor
    const user = await this.userDAO.findOne({ username });
    if (user) {
      const validPassword = await BcryptUtil.comparePassword(password, user.password).catch((error) => {
        console.error(error);
      });

      if (validPassword) {
        const payload = {
          name: user.name,
          id: user._id,
        };
        
        const token = await JWTUtil.sign(payload, process.env.SECRET_CODE).catch((error) => {
          console.error(error);
        });
       
        return {
          userId: user._id,
          token: token,
          username: username,
        };
      } else {
        errors = { message: "Incorrect Username or Password" };
        throw new Errors.CustomError(errors, 400);
      }
    } else {
      errors = { message: "Incorrect Username or Password" };
      throw new Errors.CustomError(errors, 400);
    }
  }
}

export default new AuthService();
