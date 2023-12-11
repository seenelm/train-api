import UserDAO from "../../src/dataAccess/UserDAO";
import { ResourceNotFoundError, InternalServerError } from "../../src/utils/errors";
import { UserModel, IUser } from "../../src/models/userModel";
import { Types, Query } from "mongoose";

const mockUserDoc = {
  name: "Name",
  username: "Username98",
  password: "Password123!",
};

const mockUser = {
  _id: new Types.ObjectId(),
  name: "Name",
  username: "Username98",
  password: "Password123!",
  groups: [],
  bio: ""
};

const mockUser1 = {
  _id: new Types.ObjectId(), 
  name: "Lionel Messi", 
  username: "lMessi", 
  password: "Password123!",
  groups: [],
  bio: ""
}

const mockUser2 = {
  _id: new Types.ObjectId(), 
  name: "Lionel Messi", 
  username: "lMessi2", 
  password: "Password123!",
  groups: [],
  bio: ""
}

const USER_ID = new Types.ObjectId();

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
    it("should create a new user", async () => {
      UserModel.create = jest.fn().mockResolvedValue(mockUserDoc);
      // act
      const user = await userDAO.create(mockUserDoc);

      // assert
      expect(UserModel.create).toHaveBeenCalledWith(mockUserDoc);
      expect(user).toEqual(mockUserDoc);
      
    })
    it("should throw an Internal Server Error", async () => {
      UserModel.create = jest.fn().mockRejectedValue(new Error("Database Error"));
      try {
        // act
        const user = await userDAO.create(mockUserDoc);

        // assert
        expect(user).rejects.toThrow(InternalServerError);
      } catch (error) {}
    });
  })
  describe("findById", () => {
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
  });
  describe("searchUsers", () => {
    it("should return array of users", async () => {
      const mockUsers = [ mockUser1, mockUser2 ];
      const mockQuery = "lMessi";

      jest.spyOn(UserModel, "find").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsers),
      } as unknown as Query<IUser[], any>);

      const result = await userDAO.searchUsers(mockQuery);

      expect(result).toEqual(mockUsers);
    });
    it("should return null", async () => {
      const mockQuery = "lMessi";

      jest.spyOn(UserModel, "find").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<IUser[], any>);

      const result = await userDAO.searchUsers(mockQuery);

      expect(result).toBeNull();
    });
  });
})