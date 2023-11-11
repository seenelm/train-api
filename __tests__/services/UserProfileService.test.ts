import UserProfileDAO from "../../src/dataAccess/UserProfileDAO";
import UserProfileService from "../../src/services/UserProfileService";
import { IUser } from "../../src/models/userModel";
import { IUserProfile } from "../../src/models/userProfile";
import { Types } from "mongoose";
import { ResourceNotFoundError, BadRequestError } from "../../src/utils/errors";

describe("UserProfileService", () => {
    let userProfileDAO: UserProfileDAO;
    let userProfileService: UserProfileService;

    beforeAll(() => {
        userProfileService = new UserProfileService();
        jest.mock("../../src/dataAccess/UserProfileDAO");
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("updateUserBio", () => {
        const mockUsername = "Username98";
        const mockPassword = "Password123!";
        const mockName = "Ryan Reynolds";
        const mockBio = "I love codeing!!";
        const mockUpdatedBio = "I love to workout!!";
        const USER_ID = new Types.ObjectId();

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

        it("should update users bio", async () => {
            const mockFilter = { userId: mockUser._id };
            const mockUpdate = { bio: mockUpdatedBio };
            const mockOptions = { new: true };

            const mockUpdatedUserProfile = {
                _id: mockUserProfile._id,
                userId: mockUser._id,
                name: mockName,
                bio: mockUpdatedBio
            } as IUserProfile

            try {
                userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedUserProfile);

                await userProfileService.updateUserBio(USER_ID, mockBio);

                expect(userProfileDAO.findOneAndUpdate).toEqual(mockUpdatedUserProfile);
                expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
            } catch (error) {}
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            try {
                const error = new ResourceNotFoundError("User does not exist");
                userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

                const result = await userProfileService.updateUserBio(USER_ID, mockBio);

                expect(userProfileDAO.findOneAndUpdate).toBeNull();
                expect(result).rejects.toThrow(ResourceNotFoundError);
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User does not exist");
            } catch (error) {}
        });
        it("should throw a BadRequestError when users bio is undefined", async () => {
            try {
                const error = new BadRequestError("Users Bio is Undefined");

                const result = await userProfileService.updateUserBio(USER_ID, null);

                expect(result).rejects.toThrow(BadRequestError);
                expect(error.statusCode).toEqual(400);
                expect(error.message).toEqual("Users Bio is Undefined");
            } catch (error) {}
        });
    });

    describe("updateUserFullName", () => {
        const mockUsername = "Username98";
        const mockPassword = "Password123!";
        const mockName = "Ryan Reynolds";
        const mockUpdatedName = "Deadpool";
        const mockBio = "I love codeing!!";
        const USER_ID = new Types.ObjectId();

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
            const mockUpdate = { bio: mockUpdatedName };
            const mockOptions = { new: true };

            const mockUpdatedUserProfile = {
                _id: mockUserProfile._id,
                userId: mockUser._id,
                name: mockUpdatedName,
                bio: mockBio
            } as IUserProfile

            try {
                userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUpdatedUserProfile);

                await userProfileService.updateUsersFullName(USER_ID, mockName);

                expect(userProfileDAO.findOneAndUpdate).toEqual(mockUpdatedUserProfile);
                expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
            } catch (error) {}
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            try {
                const error = new ResourceNotFoundError("User does not exist");
                userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

                const result = await userProfileService.updateUsersFullName(USER_ID, mockName);

                expect(userProfileDAO.findOneAndUpdate).toBeNull();
                expect(result).rejects.toThrow(ResourceNotFoundError);
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User does not exist");
            } catch (error) {}
        });
        it("should throw a BadRequestError when users name is undefined", async () => {
            try {
                const error = new BadRequestError("Users Name is Undefined");

                const result = await userProfileService.updateUsersFullName(USER_ID, null);

                expect(result).rejects.toThrow(BadRequestError);
                expect(error.statusCode).toEqual(400);
                expect(error.message).toEqual("Users Name is Undefined");
            } catch (error) {}
        });
    });
});