import BcryptUtil from "../../src/utils/BcryptUtil";
import JWTUtil from "../../src/utils/JWTUtil";
import UserService from "../../src/services/UserService";
import { IUser } from "../../src/models/userModel";
import { IUserProfile } from "../../src/models/userProfile";
import { IUserGroups } from "../../src/models/userGroups";
import { Types } from "mongoose";

import UserDAO from "../../src/dataAccess/UserDAO";
import UserProfileDAO from "../../src/dataAccess/UserProfileDAO";
import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import FollowDAO from "../../src/dataAccess/FollowDAO";

import * as Errors from "../../src/utils/errors";

describe("UserService", () => {
  let userDAO: UserDAO;
  let userProfileDAO: UserProfileDAO;
  let userGroupsDAO: UserGroupsDAO;
  let followDAO: FollowDAO;
  let userService: UserService;

  beforeAll(() => {
    userDAO = jest.requireMock("../../src/dataAccess/UserDAO");
    userProfileDAO = jest.requireMock("../../src/dataAccess/UserProfileDAO");
    userGroupsDAO = jest.requireMock("../../src/dataAccess/UserGroupsDAO");
    followDAO = jest.requireMock("../../src/dataAccess/FollowDAO");

    userService = new UserService(
      userDAO,
      userProfileDAO,
      userGroupsDAO,
      followDAO
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("registerUser", () => {
    it("should register a user", async () => {
      // arrange
      const mockPasswordHash = "Password123!Hash";
      const mockUsername = "username";
      const mockPassword = "Password123!";
      const mockName = "name";

      const mockNewUser = {
        _id: new Types.ObjectId(),
        username: mockUsername,
        password: mockPasswordHash,
        isActive: true,
      } as IUser;

      const mockNewUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockNewUser._id,
        name: mockName,
      } as IUserProfile;

      const mockNewUserGroups = {
        _id: new Types.ObjectId(),
        userId: mockNewUser._id,
      } as IUserGroups;

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(null);
        BcryptUtil.hashPassword = jest.fn().mockResolvedValue(mockPasswordHash);

        userDAO.create = jest.fn().mockResolvedValue(mockNewUser);
        userProfileDAO.create = jest.fn().mockResolvedValue(mockNewUserProfile);
        userGroupsDAO.create = jest.fn().mockResolvedValue(mockNewUserGroups);

        const payload = {
          name: mockNewUserProfile.name,
          userId: mockNewUser._id,
        };
        JWTUtil.sign = jest.fn().mockResolvedValue(payload);

        // act
        const result = await userService.registerUser(
          mockUsername,
          mockPassword,
          mockName
        );

        // assert
        expect(result).toEqual({
          userId: mockNewUser._id,
          token: "mockToken",
          username: mockNewUser.username,
        });

        expect(userDAO.findOne).toHaveBeenCalledWith(mockUsername);
        expect(BcryptUtil.hashPassword).toHaveBeenCalledWith(mockPassword);
        expect(userDAO.create).toHaveBeenCalledWith({
          username: mockNewUser.username,
          password: mockNewUser.password,
          isActive: mockNewUser.isActive,
        });
        expect(userProfileDAO.create).toHaveBeenCalledWith({
          userId: mockNewUser._id,
          name: mockNewUserProfile.name,
        });
        expect(userGroupsDAO.create).toHaveBeenCalledWith({
          userId: mockNewUser._id,
        });
        expect(JWTUtil.sign).toHaveBeenCalledWith(payload);
      } catch (error) {}
    });
    it("should throw a username Conflict Error", async () => {
      const mockUsername = "username";
      const mockPassword = "Password123!";
      const mockName = "name";

      const mockUser = {
        _id: new Types.ObjectId(),
        username: mockUsername,
        password: mockPassword,
        isActive: true,
      } as IUser;

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(mockUser);

        const response = await userService.registerUser(
          mockUsername,
          mockPassword,
          mockName
        );

        expect(response).rejects.toThrow(Errors.ConflictError);
        expect(Errors.ConflictError).toEqual({
          username: "username already taken",
        });
        expect(userDAO.findOne).toHaveBeenCalledWith(mockUsername);
      } catch (error) {}
    });
    it("should throw error when createUser fails", async () => {
      const mockUsername = "username";
      const mockPasswordHash = "Password123!Hash";
      const mockName = "name";

      try {
        userDAO.create = jest
          .fn()
          .mockRejectedValue(new Error("Database Error"));

        const response = await userService.registerUser(
          mockUsername,
          mockPasswordHash,
          mockName
        );

        expect(response).rejects.toThrow(Errors.InternalServerError);
      } catch (error) {}
    });
  });

  describe("loginUser", () => {
    const mockUsername = "username";
    const mockPassword = "Password123!";
    const mockName = "name";
    const mockToken = "mockToken";

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser;

    const mockUserProfile = {
      _id: new Types.ObjectId(),
      userId: mockUser._id,
      name: mockName,
    } as IUserProfile;
    it("should login the user", async () => {
      const mockPayload = {
        name: mockUserProfile.name,
        id: mockUser._id,
      };

      try {
        userDAO.findOne = jest.fn().mockResolvedValue(mockUser);
        BcryptUtil.comparePassword = jest.fn().mockResolvedValue(true);
        userProfileDAO.findOne = jest.fn().mockResolvedValue(mockUserProfile);
        JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

        const response = await userService.loginUser(
          mockUsername,
          mockPassword
        );

        expect(userDAO.findOne).toHaveBeenCalledWith(mockUsername);
        expect(BcryptUtil.comparePassword).toHaveBeenCalledWith(
          mockPassword,
          mockUser.password
        );
        expect(userProfileDAO.findOne).toHaveBeenCalledWith(mockUser._id);
        expect(JWTUtil.sign).toHaveBeenCalledWith(mockPayload);
        expect(response).toEqual({
          userId: mockUser._id,
          token: mockToken,
          username: mockUser.username,
        });
      } catch (error) {}
    });
    it("should throw an error when password is not valid", async () => {
      try {
        userDAO.findOne = jest.fn().mockResolvedValue(mockUser);
        BcryptUtil.comparePassword = jest.fn().mockResolvedValue(false);

        const response = await userService.loginUser(
          mockUsername,
          mockPassword
        );
        expect(response).rejects.toThrow(Errors.ConflictError);
        expect(userDAO.findOne).toHaveBeenCalledWith(mockUsername);

        expect(BcryptUtil.comparePassword).toHaveBeenCalledWith(
          mockPassword,
          mockUser.password
        );
        expect(BcryptUtil.comparePassword).toBe(false);
      } catch (error) {}
    });
    it("should throw an error when user is not found", async () => {
      try {
        userDAO.findOne = jest.fn().mockResolvedValue(null);

        const response = await userService.loginUser(
          mockUsername,
          mockPassword
        );
        expect(response).rejects.toThrow(Errors.ConflictError);
        expect(userDAO.findOne).toHaveBeenCalledWith(mockUsername);
        expect(userDAO.findOne).toBeNull();
      } catch (error) {}
    });
  });
});
