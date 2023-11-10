import { Request, Response, NextFunction } from "express";
import UserProfileService from "../services/UserProfileService";

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