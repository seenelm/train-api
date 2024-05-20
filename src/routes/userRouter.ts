import express from "express";
const userRouter = express.Router();
import {
  validateLogin,
  validateRegistration,
} from "../validators/userValidator";
import * as userController from "../controllers/userController";
import { authenticate } from "../__middleware__/authenticate";

userRouter.post("/register", validateRegistration, userController.register);

userRouter.post("/login", validateLogin, userController.login);
<<<<<<< Updated upstream
//delete this
userRouter.get("/:userId", authenticate, userController.findUserById);
//move this to user profile router
userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
=======

userRouter.get("/users", authenticate, userController.findUsersByIds);

// userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
>>>>>>> Stashed changes

userRouter.delete("/:userId", authenticate, userController.deleteUserAccount);

export default userRouter;
