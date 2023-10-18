const UserDAO = require("../../datastore/UserDAO");
const bcryptUtil = require("../../utils/bcryptUtil");
const jwtToken = require("../../utils/jwtToken");
const authService = require("../../services/AuthService");
const Errors = require("../../utils/errors");
jest.mock("../../datastore/UserDAO");

const mockHash = "Password123!Hash";
const username = "username";
const password = "Password123!";
const name = "name";

const newUser = {
  username: username,
  password: mockHash,
  name: name,
  _id: "userId",
};

describe("AuthService", () => {
  describe("registerUser", () => {
    test("should register a user", async () => {
      UserDAO.findOneUser = jest.fn().mockResolvedValue(null);

      bcryptUtil.hashPassword = jest.fn().mockResolvedValue(mockHash);

      UserDAO.createUser = jest.fn().mockResolvedValue(newUser);

      const payload = { name: newUser.name, id: newUser._id };
      jwtToken.sign = jest.fn().mockResolvedValue(payload);

      try {
        const result = await authService.registerUser(username, password, name);
        expect(result).toEqual({
          userId: newUser._id,
          token: "mockToken",
          username: newUser.username,
        });

        expect(UserDAO.findOneUser).toHaveBeenCalledWith(username);
        expect(bcryptUtil.hashPassword).toHaveBeenCalledWith(password);
        expect(UserDAO.createUser).toHaveBeenCalledWith({
          username: username,
          password: mockHash,
          name: name,
        });
      } catch (error) {}
    });
    test("should throw a username Conflict Error", async () => {
      const existingUser = {
        _id: "existingUserId",
        name: "name",
        username: "username",
      };
      UserDAO.findOneUser = jest.fn().mockResolvedValue(existingUser);

      try {
        const response = await authService.registerUser(
          username,
          password,
          name
        );
        expect(response.status).toBe(409);
        expect(response).toThrow(Errors.ConflictError);
        expect(response.error).toEqual({ username: "username already taken" });
      } catch (error) {}
    });
    test("should throw error when createUser fails", async () => {
      UserDAO.createUser = jest
        .fn()
        .mockRejectedValue(new Error("Database Error"));

      try {
        const response = await authService.registerUser(
          username,
          password,
          name
        );
        expect(response.status).toBe(500);
        expect(response).toThrow(Errors.InternalServerError);
      } catch (error) {}
    });
  });
});
