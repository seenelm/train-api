import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";

const userService = new UserService();

// Find user's groups.
export const fetchGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.fetchGroups(req.params.userId);
    return res.status(201).json(result.userGroups);
  } catch (error) {
    next(error);
  }
};

// Search for user.
export const findUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query;
  try {
    const users = await userService.findUsers(search);
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update users bio.
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const updateUserBio = async (req: Request, res: Response, next: NextFunction) => {
  const { userBio } = req.body;
  const { userId } = req.params;
  try {
    await userService.updateUserBio(userId, userBio);
    return res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export const updateUsersFullName = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const { userId } = req.params;
  try {
    await userService.updateUsersFullName(userId, name);
    return res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}

// Request to follow users private account.
export const requestUser = async (req: Request, res: Response) => {};

export const confirmUserRequest = async (req: Request, res: Response) => {};

export const deleteAccount = async (req: Request, res: Response) => {};
