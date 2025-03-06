import express from "express";
const userRouter = express.Router();
import {
    validateLogin,
    validateRegistration,
} from "../validators/userValidator";
import { authenticate } from "../middleware/authenticate";
import UserService from "../service/UserService";
import UserDAO from "../dao/UserDAO";
import UserProfileDAO from "../dao/UserProfileDAO";
import UserGroupsDAO from "../dao/UserGroupsDAO";
import FollowDAO from "../dao/FollowDAO";
import { UserModel } from "../model/userModel";
import { UserProfileModel } from "../model/userProfile";
import { UserGroupsModel } from "../model/userGroups";
import { FollowModel } from "../model/followModel";
import UserController from "../controller/UserController1";

const userService = new UserService(
    new UserDAO(UserModel),
    new UserProfileDAO(UserProfileModel),
    new UserGroupsDAO(UserGroupsModel),
    new FollowDAO(FollowModel),
);

const userController = new UserController(userService);

userRouter.post("/register", validateRegistration, userController.register);

userRouter.post("/login", validateLogin, userController.login);

userRouter.get("/:userId", authenticate, userController.findUserById);

// userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);

userRouter.delete("/:userId", authenticate, userController.deleteUserAccount);

export default userRouter;
