import UserDAO from "../../src/datastore/UserDAO";
import { ResourceNotFoundError } from "../../src/utils/errors";

const UserModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
};

const userData = {
  name: "Name",
  username: "Username98",
  password: "Password123!",
};

const userDAO = new UserDAO(UserModel);

describe("UserDAO", () => {
  describe("createUser", () => {
    it("should create a user", async () => {
      UserModel.create.mockResolvedValue(userData);

      const user = await userDAO.createUser(userData);
      expect(UserModel.create).toHaveBeenCalledWith(userData);
      expect(user).toEqual(userData);
    });
    it("should throw an Internal Server Error", async () => {
      UserModel.create.mockRejectedValue(new Error("Database Error"));
      try {
        const response = await userDAO.createUser(userData);
        expect(response.status).toBe(500);
      } catch (error) {
        expect(error.message).toBe("Error: Database Error");
      }
    });
  });
  describe("findOneUser", () => {
    it("should find a user", async () => {
      UserModel.findOne.mockResolvedValue(userData.username);
      const user = await userDAO.findOneUser(userData.username);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        username: userData.username,
      });
      expect(user).toBeDefined();
    });
    it("should throw a ResourceNotFoundError", async () => {
      UserModel.findOne.mockRejectedValue(new Error("User not found"));
      try {
        const response = await userDAO.findOneUser(userData.username);
        expect(response.status).toBe(404);
        expect(response.error).toThrow(ResourceNotFoundError);
      } catch (error) {
        expect(error.message).toBe("Error: User not found");
      }
    });
  });
  describe("findUserById", () => {
    it("should find a user by id", async () => {
      const userId = "123DB78";
      UserModel.findById.mockResolvedValue(userId);
      const user = await userDAO.findUserById(userId);
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(user).toBeDefined();
    });
    it("should throw a ResourceNotFoundError", async () => {
      const userId = "123DB78";
      UserModel.findById.mockRejectedValue(new Error("User not found"));
      try {
        const response = await userDAO.findUserById(userId);
        expect(response.status).toBe(404);
      } catch (error) {
        expect(error.message).toBe("Error: User not found");
      }
    });
  });
});
