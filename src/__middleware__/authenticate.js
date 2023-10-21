import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticate = (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;

  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }

  console.log("Token: ", token);

  if (!token) {
    console.log("Not authorized");
    // next(new CustomError("You are not logged in", 401));
    res.status(401).json({ error: "Not authorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_CODE);

    req.user = decodedToken;

    next();
  } catch (error) {
    // console.log("Token verification error");
  }
};
