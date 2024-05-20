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
userRouter.get("/:userId", authenticate, userController.findUserById);
<<<<<<< HEAD
userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
=======
userRouter.get("/users", authenticate, userController.findUsersByIds);

// userRouter.get("/:userId/profile-data", authenticate, userController.fetchUserData);
>>>>>>> Stashed changes
=======
>>>>>>> 5557402f803b02c79343602d1e1be99c2ea78339

userRouter.delete("/:userId", authenticate, userController.deleteUserAccount);

export default userRouter;
