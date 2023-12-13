import { NextFunction, Request, Response } from "express";
import JWTUtil from "../utils/JWTUtil";
import { InternalServerError, UnauthorizedError } from "../utils/errors";
import { UserModel } from "../models/userModel";
import { Types } from "mongoose";
import { TokenPayload } from "../services/UserService";

import * as jwt from "jsonwebtoken";
import CustomLogger from "../common/logger";

const logger = new CustomLogger("authenticate");

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const getAccessToken = (authorization: string): string => {
  let token: string;

  if (!authorization || authorization.trim() === "") {
    throw new UnauthorizedError("Missing Authorization Header", {
      authorization,
    });
  }

  let size = authorization.split(" ");

  if (size.length > 1 && authorization && authorization.startsWith("Bearer")) {
    token = size[1];
  } else {
    throw new UnauthorizedError("Invalid Authorization", {
      authorization,
      size,
    });
  }

  return token;
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getAccessToken(req.headers.authorization);

  try {
    const decodedToken = await JWTUtil.verify(token, process.env.SECRET_CODE);
    const payload = decodedToken as TokenPayload;

    const user = await UserModel.findById(new Types.ObjectId(payload.userId));

    if (!user) {
      throw new UnauthorizedError("User is not authenticated");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(error.message);
    } else {
      throw new InternalServerError("Unable to find user");
    }
  }
};
