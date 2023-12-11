import { NextFunction, Request, Response } from "express";
import JWTUtil from "../utils/JWTUtil";
import { UnauthorizedError } from "../utils/errors";
import { UserModel } from "../models/userModel";
import { Types } from "mongoose";
import { TokenPayload } from "../services/UserService";
import CustomLogger from "../common/logger";

const logger = new CustomLogger("authenticate");

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const getAccessToken = (authorization: string): string => {
  let token: string;

  if (authorization && authorization.startsWith("Bearer")) {
    let size = authorization.split(" ");
    if (size.length > 1) {
      token = size[1];
    } else {
      logger.logError("Invalid Authorization Size", null, { size, token });
    }
  }

  if (!token) {
    throw new UnauthorizedError("Invalid Authorization");
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
    logger.logInfo("User Payload ", payload);

    const user = await UserModel.findById(new Types.ObjectId(payload.userId));
    logger.logInfo("User Payload ", payload.userId);

    if (!user) {
      throw new UnauthorizedError("User is not registered");
    }

    req.user = user;
    next();
  } catch (error) {
    throw error;
  }
};
