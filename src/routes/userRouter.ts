import express from "express";
const userRouter = express.Router();
import {
  validateLogin,
  validateRegistration,
} from "../validators/userValidator";
import * as userController from "../controllers/userController";

userRouter.post("/register", validateRegistration, userController.register);

userRouter.post("/login", validateLogin, userController.login);

export default userRouter;
