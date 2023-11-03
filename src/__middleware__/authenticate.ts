import { NextFunction, Request, Response } from "express";
import JWTUtil from "../utils/JWTUtil";

// declare global {
//   namespace Express {
//     interface Request {
//       user: any
//     }
//   }
// }

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const testToken = req.headers.authorization;
  let token: string;

  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    console.log("Not authorized");
    // next(new CustomError("You are not logged in", 401));
    res.status(401).json({ error: "Not authorized" });
  }

  try {
    const decodedToken = await JWTUtil.verify(token, process.env.SECRET_CODE);

    // req.user = decodedToken;

    next();
  } catch (error) {
  }
};
