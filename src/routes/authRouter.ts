import express from "express";
const authRouter = express.Router();
import {
  validateLogin,
  validateRegistration,
} from "../validators/userValidator.js";
import * as authController from "../controllers/authController.js";

authRouter.post("/register", validateRegistration, authController.register);

authRouter.post("/login", validateLogin, authController.login);

export default authRouter;
