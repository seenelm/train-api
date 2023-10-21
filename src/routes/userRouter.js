import express from "express";
const userRouter = express.Router();
import * as usersController from "../controllers/usersController.js";
import { authenticate } from "../__middleware__/authenticate.js";

userRouter.get("/:userId", authenticate, usersController.fetchGroups);

userRouter.get("/", authenticate, usersController.findUsers);

export default userRouter;
