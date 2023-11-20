import { Request, Response, NextFunction } from "express";
import UserProfileService from "../services/UserProfileService";
import { Types } from "mongoose";

const userProfileService = new UserProfileService();

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