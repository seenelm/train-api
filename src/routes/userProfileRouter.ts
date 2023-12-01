import express from "express";
const userProfileRouter = express.Router();
import { authenticate } from "../__middleware__/authenticate";
import * as userProfileController from "../controllers/userProfileController";

userProfileRouter.get("/:userId", authenticate, userProfileController.fetchUserProfile);
userProfileRouter.get("/:userId/followers", authenticate, userProfileController.getFollowers);
userProfileRouter.get("/:userId/following", authenticate, userProfileController.getFollowing);

userProfileRouter.post("/", authenticate, userProfileController.followUser);

userProfileRouter.put("/:userId/bio", authenticate, userProfileController.updateUserBio);
userProfileRouter.patch("/:userId/name", authenticate, userProfileController.updateUsersFullName);
userProfileRouter.patch("/:userId/accountType", authenticate, userProfileController.updateAccountType);

export default userProfileRouter;