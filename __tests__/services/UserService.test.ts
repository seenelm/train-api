import BcryptUtil from "../../src/utils/BcryptUtil";
import JWTUtil from "../../src/utils/JWTUtil";
import UserService from "../../src/services/UserService";
import { IUser } from "../../src/models/userModel";
import { IUserProfile } from "../../src/models/userProfile";
import { IUserGroups } from "../../src/models/userGroups";
import { Types } from "mongoose";
import { ProfileAccess } from "../../src/common/constants";
import { IFollow } from "../../src/models/followModel";

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
      const mockToken = "mockToken";

      const mockNewUser = {
        _id: new Types.ObjectId(),
        username: mockUsername,
        password: mockPasswordHash,
        isActive: true,
      } as IUser;

      const mockNewUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockNewUser._id,
        username: mockNewUser.username,
        name: mockName,
        accountType: ProfileAccess.Public,
      } as IUserProfile;

      const mockNewUserGroups = {
        _id: new Types.ObjectId(),
        userId: mockNewUser._id,
        groups: [],
      } as Partial<IUserGroups>;

      const mockFollowDocument: Partial<IFollow> = {
        _id: new Types.ObjectId(),
        userId: mockNewUser._id,
        following: [],
        followers: [],
        requests: [],
      };

      userDAO.findOne = jest.fn().mockResolvedValue(null);
      BcryptUtil.hashPassword = jest.fn().mockResolvedValue(mockPasswordHash);

      userDAO.create = jest.fn().mockResolvedValue(mockNewUser);
      userProfileDAO.create = jest.fn().mockResolvedValue(mockNewUserProfile);
      userGroupsDAO.create = jest.fn().mockResolvedValue(mockNewUserGroups);
      followDAO.create = jest.fn().mockResolvedValue(mockFollowDocument);

      const payload = {
        name: mockNewUserProfile.name,
        userId: mockNewUser._id,
      };
      JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

      // act
      const result = await userService.registerUser(
        mockUsername,
        mockPassword,
        mockName
      );

      // assert
      expect(result).toEqual({
        userId: mockNewUser._id,
        token: mockToken,
        username: mockNewUser.username,
      });

      expect(userDAO.findOne).toHaveBeenCalledWith({ username: mockUsername });
      expect(BcryptUtil.hashPassword).toHaveBeenCalledWith(mockPassword);
      expect(userDAO.create).toHaveBeenCalledWith({
        username: mockNewUser.username,
        password: mockNewUser.password,
        isActive: mockNewUser.isActive,
      });
      expect(userProfileDAO.create).toHaveBeenCalledWith({
        userId: mockNewUser._id,
        name: mockName,
        username: mockUsername,
      });
      expect(userGroupsDAO.create).toHaveBeenCalledWith({
        userId: mockNewUser._id,
      });
      expect(followDAO.create).toHaveBeenCalledWith({
        userId: mockNewUser._id,
      });
      expect(JWTUtil.sign).toHaveBeenCalledWith(
        payload,
        process.env.SECRET_CODE
      );
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

      userDAO.findOne = jest.fn().mockResolvedValue(mockUser);

      try {
        const response = await userService.registerUser(
          mockUsername,
          mockPassword,
          mockName
        );

        expect(userDAO.findOne).toHaveBeenCalledWith({
          username: mockUsername,
        });
      } catch (error) {
        const err = error as Errors.ConflictError;
        expect(err).toBeInstanceOf(Errors.ConflictError);
        expect(err.statusCode).toEqual(409);
        expect(err.message).toEqual("username already taken");
      }
    });
  });

  describe("loginUser", () => {
    it("should login a user", async () => {
      // arrange
      const mockUsername = "username";
      const mockPassword = "Password123!";
      const mockPasswordHash = "Password123!Hash";
      const mockName = "name";
      const mockToken = "mockToken";

      const mockUser = {
        _id: new Types.ObjectId(),
        username: mockUsername,
        password: mockPasswordHash,
        isActive: true,
      } as IUser;

      const mockUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockUser._id,
        username: mockUser.username,
        name: mockName,
        accountType: ProfileAccess.Public,
      } as IUserProfile;

      userDAO.findOne = jest.fn().mockResolvedValue(mockUser);
      BcryptUtil.comparePassword = jest.fn().mockResolvedValue(true);
      userProfileDAO.findOne = jest.fn().mockResolvedValue(mockUserProfile);

      const payload = {
        name: mockUserProfile.name,
        userId: mockUser._id,
      };
      JWTUtil.sign = jest.fn().mockResolvedValue(mockToken);

      // act
      const result = await userService.loginUser(mockUsername, mockPassword);

      // assert
      expect(result).toEqual({
        userId: mockUser._id,
        token: mockToken,
        username: mockUser.username,
      });

      expect(userDAO.findOne).toHaveBeenCalledWith({ username: mockUsername });
      expect(BcryptUtil.comparePassword).toHaveBeenCalledWith(
        mockPassword,
        mockUser.password
      );
      expect(userProfileDAO.findOne).toHaveBeenCalledWith({
        userId: mockUser._id,
      });
      expect(JWTUtil.sign).toHaveBeenCalledWith(
        payload,
        process.env.SECRET_CODE
      );
    });

    it("should throw a BadRequestError if the username is incorrect", async () => {
      // arrange
      const mockUsername = "username";
      const mockPassword = "Password123!";

      userDAO.findOne = jest.fn().mockResolvedValue(null);

      try {
        const result = await userService.loginUser(mockUsername, mockPassword);
        expect(userDAO.findOne).toHaveBeenCalledWith({
          username: mockUsername,
        });
      } catch (error) {
        const err = error as Errors.BadRequestError;
        expect(err).toBeInstanceOf(Errors.BadRequestError);
        expect(err.statusCode).toEqual(400);
        expect(err.message).toEqual("Incorrect Username or Password");
      }
    });

    it("should throw a BadRequestError if the password is incorrect", async () => {
      // arrange
      const mockUsername = "username";
      const mockPassword = "Password123!";
      const mockPasswordHash = "Password123!Hash";

      const mockUser = {
        _id: new Types.ObjectId(),
        username: mockUsername,
        password: mockPasswordHash,
        isActive: true,
      } as IUser;

      userDAO.findOne = jest.fn().mockResolvedValue(mockUser);
      BcryptUtil.comparePassword = jest.fn().mockResolvedValue(false);

      try {
        const result = await userService.loginUser(mockUsername, mockPassword);
        expect(userDAO.findOne).toHaveBeenCalledWith({
          username: mockUsername,
        });
        expect(BcryptUtil.comparePassword).toHaveBeenCalledWith(
          mockPassword,
          mockUser.password
        );
      } catch (error) {
        const err = error as Errors.BadRequestError;
        expect(err).toBeInstanceOf(Errors.BadRequestError);
        expect(err.statusCode).toEqual(400);
        expect(err.message).toEqual("Incorrect Username or Password");
      }
    });
  });

  describe("findUserById", () => {
    it("should find a user by id", async () => {
      // arrange
      const mockUserId = new Types.ObjectId();

      const mockUser = {
        _id: mockUserId,
        username: "username",
        password: "Password123!Hash",
        isActive: true,
      } as IUser;

      userDAO.findUserById = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findUserById(mockUserId);

      expect(result).toEqual(mockUser);
      expect(userDAO.findUserById).toHaveBeenCalledWith(
        mockUserId,
        "username isActive"
      );
    });

    it("should throw a ResourceNotFoundError if the user is not found", async () => {
      // arrange
      const mockUserId = new Types.ObjectId();

      userDAO.findUserById = jest.fn().mockResolvedValue(null);

      try {
        const result = await userService.findUserById(mockUserId);
        expect(userDAO.findUserById).toHaveBeenCalledWith(
          mockUserId,
          "username isActive"
        );
      } catch (error) {
        const err = error as Errors.ResourceNotFoundError;
        expect(err).toBeInstanceOf(Errors.ResourceNotFoundError);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("User not found");
      }
    });
  });
});
