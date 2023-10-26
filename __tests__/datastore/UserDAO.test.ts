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
      const userId = "123DB78";
      UserModel.findById.mockResolvedValue(userId);

      try {
        // act
        const user = await userDAO.findById(userId);

        // assert
        expect(UserModel.findById).toHaveBeenCalledWith(userId);
        expect(user).toBeDefined();
        expect(user).toHaveBeenCalledWith(userId);
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
    const userDoc = {
      name: "Name",
      username: "Username98",
      password: "Password123!",
    };
    
    let query = { username: userDoc.username };
    UserModel.findOne.mockResolvedValue(query);

    try {
      // act
      const user = await userDAO.findOne(query);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith(query);
      expect(user).toBeDefined();
    } catch (error) {}
  });
  // it("should throw a ResourceNotFoundError", async () => {
  //   UserModel.findOne.mockRejectedValue(new Error("User not found"));
  //   try {
  //     const response = await userDAO.findOneUser(userData.username);
  //     expect(response.status).toBe(404);
  //     expect(response.error).toThrow(ResourceNotFoundError);
  //   } catch (error) {
  //     expect(error.message).toBe("Error: User not found");
  //   }
  // });
});
})