import express from "express";
const userRouter = express.Router();
import * as usersController from "../controllers/usersController";
import { authenticate } from "../__middleware__/authenticate";

userRouter.get("/:userId", authenticate, usersController.fetchGroups);

userRouter.get("/", authenticate, usersController.findUsers);

userRouter.put("/:userId/bio", authenticate, usersController.updateUserBio);


export default userRouter;
