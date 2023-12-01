import { Request, Response, NextFunction } from "express";
import UserProfileService from "../services/UserProfileService";
import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { UserProfileModel } from "../models/userProfile";
import FollowDAO from "../dataAccess/FollowDAO";
import { FollowModel } from "../models/followModel";
import { Types } from "mongoose";

const userProfileService = new UserProfileService(new UserProfileDAO(UserProfileModel), new FollowDAO(FollowModel));

export const updateUserBio = async (req: Request, res: Response, next: NextFunction) => {
    const { userBio } = req.body;
    const { userId } = req.params;
    try {
        await userProfileService.updateUserBio(userId, userBio);
        return res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
}
  
export const updateUsersFullName = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const { userId } = req.params;
    try {
        await userProfileService.updateUsersFullName(userId, name);
        return res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const fetchUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    let id = new Types.ObjectId(userId);
    try {
        const userProfile = await userProfileService.fetchUserProfile(id);
        return res.status(201).json(userProfile);
    } catch (error) {
        next(error);
    }
}

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
    const { followeeId } = req.body;

    const followeeID = new Types.ObjectId(followeeId);
    const followerId = req.user._id;

    try {
        await userProfileService.followUser(followerId, followeeID);
        return res.status(201).json({success: true});
    } catch (error) {
        next(error);
    }
}

export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const userID = new Types.ObjectId(userId);

    try {
        const followers = await userProfileService.getFollowers(userID);
        return res.status(201).json(followers);
    } catch (error) {
        next(error);
    }
}

export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const userID = new Types.ObjectId(userId);

    try {
        const following = await userProfileService.getFollowing(userID);
        return res.status(201).json(following);
    } catch (error) {
        next(error);
    }
}

export const updateAccountType = async (req: Request, res: Response, next: NextFunction) => {
    const { accountType } = req.body;
    const { userId } = req.params;
    const userID = new Types.ObjectId(userId);

    try {
        await userProfileService.updateAccountType(userID, accountType);
        return res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
};