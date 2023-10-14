const bcrypt = require("bcrypt");

const bcryptUtil = {
  hashPassword: (password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 12, (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve(hash);
        }
      });
    });
  },
};

module.exports = bcryptUtil;
