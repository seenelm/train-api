import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import JWTUtil from "../utils/JWTUtil";
import BcryptUtil from "../utils/BcryptUtil";
import { UserModel } from "../models/userModel";
import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { UserProfileModel } from "../models/userProfile";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";

class UserService {
  private userDAO: UserDAO;
  private userProfileDAO: UserProfileDAO;
  private userGroupsDAO: UserGroupsDAO;

  constructor() {
    this.userDAO = new UserDAO(UserModel);
    this.userProfileDAO = new UserProfileDAO(UserProfileModel);
    this.userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
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
        .create({ username, password: hash, isActive: true })
        .catch((error) => {
          // Log Error.
          throw error;
        });

      const newUserProfile = await this.userProfileDAO.create({ 
        userId: newUser._id,
        name 
      });

      await this.userGroupsDAO.create({ userId: newUser._id });

      const payload = {
        name: newUserProfile.name,
        userId: newUser._id,
      };

      const token = await JWTUtil.sign(payload, process.env.SECRET_CODE).catch((error) => {
        console.error(error);
      });

      return { userId: newUser._id, token, username };
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
        const userProfile = await this.userProfileDAO.findOne({ userId: user._id });

        const payload = {
          name: userProfile.name,
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

export default UserService;
