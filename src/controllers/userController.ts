import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";

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
