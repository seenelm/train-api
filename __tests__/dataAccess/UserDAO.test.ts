import UserDAO from "../../src/dataAccess/UserDAO";
import { InternalServerError } from "../../src/utils/errors";
import { UserModel, IUser } from "../../src/models/userModel";
import { Types, Query } from "mongoose";

describe("UserDAO", () => {
  let userDAO: UserDAO;

  beforeAll(() => {
    jest.mock("../../src/models/userModel");
    userDAO = new UserDAO(UserModel);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser

    it("should create a new user", async () => {
      UserModel.create = jest.fn().mockResolvedValue(mockUser);
      // act
      const user = await userDAO.create(mockUser);

      // assert
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
      
    })
    it("should throw an Internal Server Error", async () => {
      UserModel.create = jest.fn().mockRejectedValue(new Error("Database Error"));
      try {
        // act
        const user = await userDAO.create(mockUser);

        // assert
        expect(user).rejects.toThrow(InternalServerError);
      } catch (error) {}
    });
  });

  describe("findById", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";
    const USER_ID = new Types.ObjectId();

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser

    it("should find a user by id", async () => {
      // arrange
      jest.spyOn(UserModel, "findById").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as unknown as Query<IUser, any>)
      // act
      const user = await userDAO.findById(USER_ID);

      // assert
      expect(UserModel.findById).toHaveBeenCalledWith(USER_ID);
      expect(user).toEqual(mockUser);
    });
    it("should return null", async () => {
      jest.spyOn(UserModel, "findById").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<IUser, any>)

      // act
      const user = await userDAO.findById(USER_ID);

      // assert
      expect(user).toBe(null);
    });
  });


  describe("findOne", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser
    
    it("should find a user", async () => {
      // arrange
      let query = { username: mockUser.username };

      jest.spyOn(UserModel, "findOne").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as unknown as Query<IUser, any>)

      // act
      const user = await userDAO.findOne(query);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith(query);
      expect(user).toEqual(mockUser);
    });
    it("should return null", async () => {
      // arrange
      let query = { username: mockUser.username };

      jest.spyOn(UserModel, "findOne").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<IUser, any>)

      // act
      const user = await userDAO.findOne(query);

      // assert
      expect(user).toBeNull();
    });
  });
});