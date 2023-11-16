import express from "express";
const userGroupsRouter = express.Router();
import * as userGroupsController from "../controllers/userGroupsController";
import { authenticate } from "../__middleware__/authenticate";

userGroupsRouter.get("/:userId/groups", authenticate, userGroupsController.fetchGroups);

export default userGroupsRouter;
