import express from "express";
const userRouter = express.Router();
import {
    validateLogin,
    validateRegistration,
} from "../validators/userValidator";
import * as userController from "../controller/userController";
import { authenticate } from "../middleware/authenticate";

userRouter.post("/register", validateRegistration, userController.register);

userRouter.post("/login", validateLogin, userController.login);

userRouter.get("/:userId", authenticate, userController.findUserById);

// userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);

userRouter.delete("/:userId", authenticate, userController.deleteUserAccount);

export default userRouter;
