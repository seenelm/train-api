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
<<<<<<< HEAD
<<<<<<< Updated upstream
//delete this
userRouter.get("/:userId", authenticate, userController.findUserById);
//move this to user profile router
userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
=======

userRouter.get("/users", authenticate, userController.findUsersByIds);

// userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
>>>>>>> Stashed changes
=======

userRouter.get("/:userId", authenticate, userController.findUserById);

// userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
>>>>>>> 5c4818d2c1977bcc70f66b3d2d1e8f1147d1e7ba

userRouter.delete("/:userId", authenticate, userController.deleteUserAccount);

export default userRouter;
