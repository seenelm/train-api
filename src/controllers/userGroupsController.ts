import { Request, Response, NextFunction } from "express";
import UserGroupsService from "../services/UserGroupsService";

const userGroupsService = new UserGroupsService();

// Find user's groups.
export const fetchGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userGroupsService.fetchGroups(req.params.userId);
    return res.status(201).json(result.userGroups);
  } catch (error) {
    next(error);
  }
};

// Search for user.
export const findUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query;
  try {
    // const users = await userService.findUsers(search);
    // return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};


// Request to follow users private account.
export const requestUser = async (req: Request, res: Response) => {};

export const confirmUserRequest = async (req: Request, res: Response) => {};

export const deleteAccount = async (req: Request, res: Response) => {};
