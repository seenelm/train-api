import express from "express";
const userRouter = express.Router();
import * as usersController from "../controllers/usersController";
import { authenticate } from "../__middleware__/authenticate";

userRouter.get("/:userId", authenticate, usersController.fetchGroups);

userRouter.get("/", authenticate, usersController.findUsers);

userRouter.put("/:userId/profile/bio", authenticate, usersController.updateUserBio);
userRouter.patch("/:userId/profile/name", authenticate, usersController.updateUsersFullName);


export default userRouter;
