import UserProfileDAO from "../../src/dataAccess/UserProfileDAO";
import { InternalServerError } from "../../src/utils/errors";
import { IUser } from "../../src/models/userModel";
import { UserProfileModel, IUserProfile } from "../../src/models/userProfile";
import { Types, Query } from "mongoose";

describe("UserDAO", () => {
  let userProfileDAO: UserProfileDAO;

  beforeAll(() => {
    jest.mock("../../src/models/userProfile");
    userProfileDAO = new UserProfileDAO(UserProfileModel);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";
    const mockName = "ngross";
    const mockBio = "I love codeing!!";

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser

    const mockUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockUser._id,
        name: mockName,
        bio: mockBio
    } as IUserProfile

    it("should create a new user profile", async () => {
      UserProfileModel.create = jest.fn().mockResolvedValue(mockUserProfile);
      // act
      const userProfile = await userProfileDAO.create(mockUser);

      // assert
      expect(userProfile).toEqual(mockUserProfile);
      
    })
    it("should throw an Internal Server Error", async () => {
      UserProfileModel.create = jest.fn().mockRejectedValue(new Error("Database Error"));
      try {
        // act
        const userProfile = await userProfileDAO.create(mockUserProfile);

        // assert
        expect(userProfile).rejects.toThrow(InternalServerError);
      } catch (error) {}
    });
  });

  describe("findById", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";
    const mockName = "ngross";
    const mockBio = "I love codeing!!";
    const USER_PROFILE_ID = new Types.ObjectId();

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser

    const mockUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockUser._id,
        name: mockName,
        bio: mockBio
    } as IUserProfile

    it("should find a users profile by id", async () => {
      // arrange
      jest.spyOn(UserProfileModel, "findById").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserProfile),
      } as unknown as Query<IUserProfile, any>)
      // act
      const userProfile = await userProfileDAO.findById(USER_PROFILE_ID);

      // assert
      expect(UserProfileModel.findById).toHaveBeenCalledWith(USER_PROFILE_ID);
      expect(userProfile).toEqual(mockUserProfile);
    });
    it("should return null", async () => {
      jest.spyOn(UserProfileModel, "findById").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<IUserProfile, any>)

      // act
      const userProfile = await userProfileDAO.findById(USER_PROFILE_ID);

      // assert
      expect(userProfile).toBe(null);
    });
  });


  describe("findOne", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";
    const mockName = "ngross";
    const mockBio = "I love codeing!!";

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser

    const mockUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockUser._id,
        name: mockName,
        bio: mockBio
    } as IUserProfile
    
    it("should find a users profile", async () => {
      // arrange
      let query = { _id: mockUserProfile._id };

      jest.spyOn(UserProfileModel, "findOne").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserProfile),
      } as unknown as Query<IUserProfile, any>)

      // act
      const userProfile = await userProfileDAO.findOne(query);

      // assert
      expect(UserProfileModel.findOne).toHaveBeenCalledWith(query);
      expect(userProfile).toEqual(mockUserProfile);
    });
    it("should return null", async () => {
      // arrange
      let query = { _id: mockUserProfile._id };

      jest.spyOn(UserProfileModel, "findOne").mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as Query<IUserProfile, any>)

      // act
      const userProfile = await userProfileDAO.findOne(query);

      // assert
      expect(userProfile).toBeNull();
    });
  });

  describe("findOneAndUpdate", () => {
    const mockUsername = "Username98";
    const mockPassword = "Password123!";
    const mockName = "Ryan Reynolds";
    const mockUpdatedName = "DeadPool";
    const mockBio = "I love codeing!!";
    const mockUpdatedBio = "I love to workout!!";

    const mockUser = {
      _id: new Types.ObjectId(),
      username: mockUsername,
      password: mockPassword,
      isActive: true,
    } as IUser

    const mockUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockUser._id,
        name: mockName,
        bio: mockBio
    } as IUserProfile

    it("should update users name in profile", async () => {
        const mockFilter = { userId: mockUser._id };
        const mockUpdate = { name: mockUpdatedName };
        const mockOptions = { new: true };

        const mockUpdatedUserProfile = {
            _id: mockUserProfile._id,
            userId: mockUser._id,
            name: mockUpdatedName,
            bio: mockBio
        } as IUserProfile

        jest.spyOn(UserProfileModel, "findOneAndUpdate").mockReturnThis()
        .mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUpdatedUserProfile),
        } as unknown as Query<IUserProfile, any>);

        const userProfile = await userProfileDAO.findOneAndUpdate(mockFilter, mockUpdate, mockOptions);

        expect(userProfile).toEqual(mockUpdatedUserProfile);
    });
    it("should update users bio in profile", async () => {
        const mockFilter = { userId: mockUser._id };
        const mockUpdate = { bio: mockUpdatedBio };
        const mockOptions = { new: true };

        const mockUpdatedUserProfile = {
            _id: mockUserProfile._id,
            userId: mockUser._id,
            name: mockName,
            bio: mockUpdatedBio
        } as IUserProfile

        jest.spyOn(UserProfileModel, "findOneAndUpdate").mockReturnThis()
        .mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUpdatedUserProfile),
        } as unknown as Query<IUserProfile, any>);

        const userProfile = await userProfileDAO.findOneAndUpdate(mockFilter, mockUpdate, mockOptions);

        expect(userProfile).toEqual(mockUpdatedUserProfile);
    });
    it("should return null", async () => {
        const mockFilter = { userId: mockUser._id };
        const mockUpdate = { bio: mockUpdatedBio };
        const mockOptions = { new: true };

        jest.spyOn(UserProfileModel, "findOneAndUpdate").mockReturnThis()
        .mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as unknown as Query<IUserProfile, any>);

        const userProfile = await userProfileDAO.findOneAndUpdate(mockFilter, mockUpdate, mockOptions);
        expect(userProfile).toBeNull();
    });
  });
});