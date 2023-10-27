import UserDAO from "../dataAccess/UserDAO.js";
import * as Errors from "../utils/errors.js";

class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  public async fetchGroups(userId: string) {
    const user = await this.userDAO.findById(userId, "groups");

    if (!user) {
      throw new Errors.ResourceNotFoundError("User not found");
    }

    const userGroups = user.groups.map((group) => ({
      id: group._id,
      // name: group
    }));

    return { groups: userGroups };
  }

}

export default new UserService();
