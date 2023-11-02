import UserModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";

// Find user's groups.
export const fetchGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.params.userId);
    const result = await UserService.fetchGroups(req.params.userId);
    return res.status(201).json(result.userGroups);
  } catch (error) {
    next(error);
  }
};

// Search for user.
export const findUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchUsers = await UserModel.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    const users = searchUsers.map((user) => ({
      username: user.username,
      name: user.name,
    }));

    res.status(201).json(users);
  } catch (error) {
    return res.status(503);
  }
};

// Request to follow users private account.
export const requestUser = async (req: Request, res: Response) => {};

export const confirmUserRequest = async (req: Request, res: Response) => {};

export const deleteAccount = async (req: Request, res: Response) => {};
