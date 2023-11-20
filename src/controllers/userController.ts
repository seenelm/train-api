import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import logger from "../common/logger";
import { Types } from "mongoose";

const userService = new UserService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, name } = req.body;

    const result = await userService.registerUser(username, password, name);

    return res.status(201).json({
      userId: result.userId,
      token: result.token,
      username: result.username,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await userService.loginUser(username, password);
    return res.status(201).json({
      userId: result.userId,
      token: result.token,
      username: result.username,
    });
  } catch (error) {
    next(error);
  }
};

export const findUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    let id = new Types.ObjectId(userId);
    const user = await userService.findUserById(id);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export const fetchUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    let id = new Types.ObjectId(userId);
    const userData = await userService.fetchUserData(id);
    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
}
