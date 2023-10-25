import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

import AuthService from "../services/AuthService.js";
import catchError from "../utils/catchError.js";

// const authService = new AuthService();
export const register = async (req, res, next) => {
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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let errors = {};

    const user = await UserModel.findOne({ username });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const payload = {
          name: user.name,
          id: user._id,
        };
        const token = jwt.sign(payload, process.env.SECRET_CODE);
        return res.status(201).json({
          success: true,
          userId: user._id,
          token: token,
          username: username,
        });
      } else {
        errors = { message: "Incorrect Username or Password" };
        return res.status(400).json({ errors });
      }
    } else {
      errors = { message: "Incorrect Username or Password" };
      return res.status(400).json({ errors });
    }
  } catch (error) {
    return res.status(503).json({ error: "Error Logging in User" });
  }
};

// Logout of application and remove token.
export const logout = async (req, res) => {};
