import { NextFunction, Request, Response } from "express";
import JWTUtil from "../utils/JWTUtil";
import { UnauthorizedError } from "../utils/errors";
import { UserModel } from "../models/userModel";
import { Types } from "mongoose";
import { TokenPayload } from "../services/UserService";
import logger from "../common/logger";

declare global {
  namespace Express {
    interface Request {
      user: any
    }
  }
}

const getAccessToken = (authorization: string): string => {
  let token: string;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if(!token) {
    throw new UnauthorizedError("Invalid Authorization");
  }
  
  return token;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // const testToken = req.headers.authorization;
  // let token: string;

  // if (testToken && testToken.startsWith("Bearer")) {
  //   token = testToken.split(" ")[1];
  // }

  // if (!token) {
  //   console.log("Not authorized");
  //   throw new UnauthorizedError("Invalid Authorization");
  // }

  const token = getAccessToken(req.headers.authorization);

  try {
    const decodedToken = await JWTUtil.verify(token, process.env.SECRET_CODE);
    const payload = decodedToken as TokenPayload;
    logger.info("User Payload ", payload);

    const user = await UserModel.findById(new Types.ObjectId(payload.userId));
    logger.info("User Payload ", payload.userId);


    if (!user) {
      throw new UnauthorizedError("User is not registered");
    }

    req.user = user;
    next();
  } catch (error) {
    throw error;
  }
};
