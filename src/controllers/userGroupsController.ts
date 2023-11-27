import { Request, Response, NextFunction } from "express";
import UserGroupsService from "../services/UserGroupsService";
import { Types } from "mongoose";

const userGroupsService = new UserGroupsService();

// Find user's groups.
export const fetchUserGroups = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const userID = new Types.ObjectId(userId);

  try {
    const result = await userGroupsService.fetchUserGroups(userID);
    return res.status(201).json(result.userGroups);
  } catch (error) {
    next(error);
  }
};


// Request to follow users private account.
export const requestUser = async (req: Request, res: Response) => {};

export const confirmUserRequest = async (req: Request, res: Response) => {};

export const deleteAccount = async (req: Request, res: Response) => {};
