import express from "express";
const userProfileRouter = express.Router();
import { authenticate } from "../__middleware__/authenticate";
import * as userProfileController from "../controllers/userProfileController";

userProfileRouter.get("/:userId", authenticate, userProfileController.fetchUserProfile);
userProfileRouter.put("/:userId/bio", authenticate, userProfileController.updateUserBio);
userProfileRouter.patch("/:userId/name", authenticate, userProfileController.updateUsersFullName);

export default userProfileRouter;