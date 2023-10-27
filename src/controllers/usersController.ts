import UserModel from "../models/userModel";
import { Request, Response } from "express";

// Find user's groups.
export const fetchGroups = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate("groups");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGroups = user.groups.map((group) => ({
      id: group._id,
      // name: group.name,
    }));

    return res.status(201).json({ groups: userGroups });
  } catch (error) {
    return res.status(503);
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
