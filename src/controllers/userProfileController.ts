import { Request, Response, NextFunction } from "express";
import UserProfileService from "../services/UserProfileService";
import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { UserProfileModel } from "../models/userProfile";
import FollowDAO from "../dataAccess/FollowDAO";
import { FollowModel } from "../models/followModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import { Types, ObjectId } from "mongoose";

import { StatusCodes as HttpStatusCode } from "http-status-codes";
import {
    FetchUserGroupsRequest,
    UpdateUserProfileRequest,
} from "../dtos/userProfileDTO";
import { plainToClass } from "class-transformer";
import { DTOValidatorService } from "../validators/validator";

class UserProfileController {
    private userProfileService: UserProfileService;
    private dtoValidatorService: DTOValidatorService;

    constructor(
        dtoValidatorService: DTOValidatorService,
        userProfileService: UserProfileService,
    ) {
        this.dtoValidatorService = dtoValidatorService;
        this.userProfileService = userProfileService;
    }

    fetchUserGroups = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const fetchUserGroupsRequest = plainToClass(
                FetchUserGroupsRequest,
                req.params,
            );

            const errors = await this.dtoValidatorService.validateRequest(
                fetchUserGroupsRequest,
            );

            if (errors) {
                return res.status(HttpStatusCode.BAD_REQUEST).json(errors);
            }

            const result = await this.userProfileService.fetchUserGroups(
                fetchUserGroupsRequest,
            );

            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    };

    updateUserProfile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const updateUserProfileRequest = plainToClass(
                UpdateUserProfileRequest,
                { ...req.body, userId: req.params.userId },
            );

            const errors = await this.dtoValidatorService.validateRequest(
                updateUserProfileRequest,
            );

            if (errors) {
                console.log(errors);
                return res.status(HttpStatusCode.BAD_REQUEST).json(errors);
            }

            await this.userProfileService.updateUserProfile(
                updateUserProfileRequest,
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    fetchUserData = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) =>  {
        const { userId } = req.params;
        // const userID = new Types.ObjectId(userId);

        try {
            const result = await this.userProfileService.fetchUserData(userId);
            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    fetchUserProfile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { userId } = req.params;
        let id = new Types.ObjectId(userId);
        try {
            const userProfile =
                await this.userProfileService.fetchUserProfile(id);
            return res.status(HttpStatusCode.OK).json(userProfile);
        } catch (error) {
            next(error);
        }
    }

    fetchFollowData = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { userId } = req.params;
        const userID = new Types.ObjectId(userId);

        try {
            const followData =
                await this.userProfileService.fetchFollowData(userID);
            return res.status(HttpStatusCode.OK).json(followData);
        } catch (error) {
            next(error);
        }
    }

    // Get followers and following

    getFollowers = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const userID = new Types.ObjectId(userId);

        try {
            const followers =
                await this.userProfileService.getFollowers(userID);
            return res.status(HttpStatusCode.OK).json(followers);
        } catch (error) {
            next(error);
        }
    }

    getFollowing = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const userID = new Types.ObjectId(userId);

        try {
            const following =
                await this.userProfileService.getFollowing(userID);
            return res.status(HttpStatusCode.OK).json(following);
        } catch (error) {
            next(error);
        }
    }


    followUser = async (req: Request, res: Response, next: NextFunction) => {
        const { followeeId } = req.params;

        const followeeID = new Types.ObjectId(followeeId);
        const followerId = new Types.ObjectId(req.user._id);

        try {
            await this.userProfileService.followUser(followerId, followeeID);
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    requestToFollowUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { followeeId } = req.params;

        const followeeID = new Types.ObjectId(followeeId);
        const followerId = req.user._id;

        try {
            await this.userProfileService.requestToFollowUser(
                followerId,
                followeeID,
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    acceptFollowRequest = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { followerId } = req.body;

        const followeeID = req.user._id;
        const followerID = new Types.ObjectId(followerId);

        try {
            await this.userProfileService.acceptFollowRequest(
                followeeID,
                followerID,
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    rejectFollowRequest = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { followerId } = req.body;

        const followeeID = req.user._id;
        const followerID = new Types.ObjectId(followerId);

        try {
            await this.userProfileService.rejectFollowRequest(
                followeeID,
                followerID,
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    removeFollower = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { followerId } = req.body;

        const followeeID = req.user._id;
        const followerID = new Types.ObjectId(followerId);

        try {
            await this.userProfileService.removeFollower(
                followeeID,
                followerID,
            );
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
        const { followeeId } = req.body;

        const followeeID = new Types.ObjectId(followeeId);
        const followerId = req.user._id;

        try {
            await this.userProfileService.unfollowUser(followerId, followeeID);
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }
}

export default UserProfileController;
