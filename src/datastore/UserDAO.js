const Errors = require("../utils/errors");
class UserDAO {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async createUser(userData) {
    const user = await this.User.create(userData).catch((error) => {
      // console.error("Error creating user: ", error);
      throw new Errors.InternalServerError(error);
    });
    return user;
  }

  async findOneUser(userData) {
    const user = await this.User.findOne({ userData })
      .exec()
      .catch((error) => {
        console.error("Unable to find user: ", error);
        throw new Errors.ResourceNotFoundError(error);
      });
    return user;
  }

  async findUserById(userId) {
    const user = await this.User.findById(userId).catch((error) => {
      console.error("Unable to find user by Id: ", error);
      throw new Errors.ResourceNotFoundError(error);
    });
    return user;
  }
}

module.exports = UserDAO;
