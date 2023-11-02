import express from "express";
const authRouter = express.Router();
import {
  validateLogin,
  validateRegistration,
} from "../validators/userValidator";
import * as authController from "../controllers/authController";

authRouter.post("/register", validateRegistration, authController.register);

authRouter.post("/login", validateLogin, authController.login);

export default authRouter;
