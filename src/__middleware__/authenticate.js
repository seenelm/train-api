const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");

const authenticate = async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;

  if (testToken && testToken.startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    next(new CustomError("You are not logged in", 401));
  }

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_CODE
  );

  console.log(decodedToken);

  next();
};

module.exports = authenticate;
