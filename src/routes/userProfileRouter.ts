import express from "express";
const userProfileRouter = express.Router();
import { authenticate } from "../__middleware__/authenticate";
// import * as userProfileController from "../controllers/userProfileController";
import UserProfileController from "../controllers/userProfileController";
import { validateRequest } from "../validators/validator";
import {
    FetchUserGroupsRequest,
    UpdateUserProfileRequest,
    FetchUserDataRequest,
} from "../dtos/userProfileDTO";

import UserProfileService from "../services/UserProfileService";
import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { UserProfileModel } from "../models/userProfile";
import FollowDAO from "../dataAccess/FollowDAO";
import { FollowModel } from "../models/followModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import { DTOValidatorService } from "../validators/validator";

const dtoValidatorService = new DTOValidatorService();
const userProfileService = new UserProfileService(
    new UserProfileDAO(UserProfileModel),
    new FollowDAO(FollowModel),
    new UserGroupsDAO(UserGroupsModel),
);
const userProfileController = new UserProfileController(
    dtoValidatorService,
    userProfileService,
);

userProfileRouter.get(
    "/:userId/groups",
    authenticate,
    userProfileController.fetchUserGroups,
);

// userProfileRouter.get(
//     "/:userId",
//     validateRequest(FetchUserDataRequest, ["params"]),
//     authenticate,
//     userProfileController.fetchUserData,
// );

userProfileRouter.get(
    "/:userId/profile",
    authenticate,
    userProfileController.fetchUserProfile,
);

userProfileRouter.get(
    "/:userId/followData",
    authenticate,
    userProfileController.fetchFollowData,
);

userProfileRouter.get(
    "/:userId/followers",
    authenticate,
    userProfileController.getFollowers,
);
userProfileRouter.get(
    "/:userId/following",
    authenticate,
    userProfileController.getFollowing,
);

userProfileRouter.post(
    "/:followeeId/follow",
    authenticate,
    userProfileController.followUser,
);

userProfileRouter.put(
    "/:userId/profile",
    authenticate,
    // validateRequest(UpdateUserProfileRequest, ["params", "body"]),
    userProfileController.updateUserProfile,
);

userProfileRouter.patch(
    "/follow/requests/:followeeId",
    authenticate,
    userProfileController.requestToFollowUser,
);
userProfileRouter.patch(
    "/follow/:followerId/accept",
    authenticate,
    userProfileController.acceptFollowRequest,
);
userProfileRouter.patch(
    "/follow/:followerId/reject",
    authenticate,
    userProfileController.rejectFollowRequest,
);
userProfileRouter.patch(
    "/follow/:followerId/remove",
    authenticate,
    userProfileController.removeFollower,
);
userProfileRouter.patch(
    "/follow/:followeeId/unfollow",
    authenticate,
    userProfileController.unfollowUser,
);
// userProfileRouter.put(
//   "/:userId/bio",
//   authenticate,
//   userProfileController.updateUserBio
// );

// userProfileRouter.patch(
//   "/:userId/name",
//   authenticate,
//   userProfileController.updateUsersFullName
// );
// userProfileRouter.patch(
//   "/:userId/accountType",
//   authenticate,
//   userProfileController.updateAccountType
// );

export default userProfileRouter;
