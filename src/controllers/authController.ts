import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, name } = req.body;

    const result = await AuthService.registerUser(username, password, name);
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

    const result = await AuthService.loginUser(username, password);
    return res.status(201).json({
      userId: result.userId,
      token: result.token,
      username: result.username,
    });
  } catch (error) {
    next(error);
  }
};

// Logout of application and remove token.
export const logout = async (req, res) => {};
