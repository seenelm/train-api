import jwt from "jsonwebtoken";

const jwtToken = {
  sign: (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.SECRET_CODE, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  },
};

export default jwtToken;
