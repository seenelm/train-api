import UserDAO from "../../src/dataAccess/UserDAO";
import { ResourceNotFoundError, InternalServerError } from "../../src/utils/errors";

const UserModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
};

describe("UserDAO", () => {
  let userDAO: UserDAO;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    // arrange
    it("should create a new user", async () => {
      const userDoc = {
        name: "Name",
        username: "Username98",
        password: "Password123!",
      };

      UserModel.create.mockResolvedValue(userDoc);

      try {
        // act
        const user = await userDAO.create(userDoc);

        // assert
        expect(UserModel.create).toHaveBeenCalledWith(userDoc);
        expect(user).toEqual(userDoc);
      } catch (error) {}
    })
    it("should throw an Internal Server Error", async () => {

      // arrange 
      const userDoc = {
        name: "Name",
        username: "Username98",
        password: "Password123!",
      };

      UserModel.create.mockRejectedValue(new Error("Database Error"));
      try {
        // act
        const user = await userDAO.create(userDoc);

        // assert
        expect(user).rejects.toThrow(InternalServerError);
      } catch (error) {}
    });
  })
  describe("findById", () => {
    it("should find a user by id", async () => {
      // arrange
      const mockUser = {
        name: "Name",
        username: "Username98",
        password: "Password123!",
        _id: "userId"
      };

      const userId = "123DB78";

      UserModel.findById.mockResolvedValue(mockUser);

      try {
        // act
        const user = await userDAO.findById(userId);

        // assert
        expect(UserModel.findById).toHaveBeenCalledWith(mockUser);
        expect(user).toEqual(mockUser);
      } catch (error) {}
    });
    it("should throw a ResourceNotFoundError", async () => {
      // arrange
      const userId = "123DB78";
      UserModel.findById.mockRejectedValue(new Error("User not found"));

      try {
        // act
        const user = await userDAO.findById(userId);

        // assert
        expect(user).rejects.toThrow(ResourceNotFoundError);
      } catch (error) {}
    });
  });
  describe("findOne", () => {
  it("should find a user", async () => {
    // arrange
    const mockUser = {
      name: "Name",
      username: "Username98",
      password: "Password123!",
    };
    
    let query = { username: mockUser.username };

    UserModel.findOne.mockResolvedValue(mockUser);

    try {
      // act
      const user = await userDAO.findOne(query);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    } catch (error) {}
  });
});
})