import UserDAO from "../../src/dataAccess/UserDAO";
import BcryptUtil from "../../src/utils/BcryptUtil";
import JWTUtil from "../../src/utils/JWTUtil";
import AuthService from "../../src/services/AuthService";
import * as Errors from "../../src/utils/errors";
jest.mock("../../src/dataAccess/UserDAO");

describe("AuthService", () => {
  let userDAO: UserDAO;

  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("registerUser", () => {
    it("should register a user", async () => {
      // arrange
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

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(null);
        BcryptUtil.hashPassword = jest.fn().mockResolvedValue(mockHash);
        userDAO.create= jest.fn().mockResolvedValue(newUser);

        const payload = { name: newUser.name, id: newUser._id };
        JWTUtil.sign = jest.fn().mockResolvedValue(payload);

        // act
        const result = await AuthService.registerUser(username, password, name);

        // assert
        expect(result).toEqual({
          userId: newUser._id,
          token: "mockToken",
          username: newUser.username,
        });

        expect(userDAO.findOne).toHaveBeenCalledWith(username);
        expect(BcryptUtil.hashPassword).toHaveBeenCalledWith(password);
        expect(userDAO.create).toHaveBeenCalledWith({
          username: username,
          password: mockHash,
          name: name,
        });
      } catch (error) {}
      
    });
    it("should throw a username Conflict Error", async () => {
      const existingUser = {
        _id: "existingUserId",
        name: "name",
        username: "username",
      };

      const username = "username";
      const password = "Password123!";
      const name = "name";

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(existingUser);

        const response = await AuthService.registerUser(
          username,
          password,
          name
        );
    
        expect(response).rejects.toThrow(Errors.ConflictError);
        expect(Errors.ConflictError).toEqual({ username: "username already taken" });
      } catch (error) {}
    });
    it("should throw error when createUser fails", async () => {
      const username = "username";
      const password = "Password123!";
      const name = "name";

      try {
        userDAO.create = jest
          .fn()
          .mockRejectedValue(new Error("Database Error"));

      
        const response = await AuthService.registerUser(
          username,
          password,
          name
        );
        
        expect(response).rejects.toThrow(Errors.InternalServerError);
      } catch (error) {}
    });
  });
  describe("loginUser", () => {
    it("should login the user", async () => {
      const mockUser = {
        username: "username",
        password: "Password123!",
        name: "name",
        _id: "userId",
      }

      const mockToken = "mockToken";

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(mockUser);
        BcryptUtil.comparePassword = jest.fn().mockResolvedValue(true);
        JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

        const response = await AuthService.loginUser("username", "Password123!");
        expect(response).toEqual({
          userId: mockUser._id,
          token: mockToken,
          username: mockUser.username
        })
      } catch (error) {}
    });
    it("should throw an error when password is not valid", async () => {
      const mockUser = {
        username: "username",
        password: "Password123!",
        name: "name",
        _id: "userId",
      }

      const mockToken = "mockToken";

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(mockUser);
        BcryptUtil.comparePassword = jest.fn().mockResolvedValue(false);
        JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

        const response = await AuthService.loginUser("username", "Password123!");
        expect(response).rejects.toThrow(Errors.ConflictError);

      } catch (error) {}
    });
    it("should throw an error when user is not found", async () => {
      const mockToken = "mockToken";

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(null);
        BcryptUtil.comparePassword = jest.fn().mockResolvedValue(true);
        JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

        const response = await AuthService.loginUser("username", "Password123!");
        expect(response).rejects.toThrow(Errors.ConflictError);

      } catch (error) {}
    });
  });
});
