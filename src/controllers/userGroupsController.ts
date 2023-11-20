import { Request, Response, NextFunction } from "express";
import UserGroupsService from "../services/UserGroupsService";

const userGroupsService = new UserGroupsService();

// Find user's groups.
export const fetchUserGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userGroupsService.fetchUserGroups(req.params.userId);
    return res.status(201).json(result.userGroups);
  } catch (error) {
    next(error);
  }
};


// Request to follow users private account.
export const requestUser = async (req: Request, res: Response) => {};

export const confirmUserRequest = async (req: Request, res: Response) => {};

export const deleteAccount = async (req: Request, res: Response) => {};
