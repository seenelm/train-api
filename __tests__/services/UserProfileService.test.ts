import UserProfileDAO from "../../src/dataAccess/UserProfileDAO";
import UserProfileService from "../../src/services/UserProfileService";
import FollowDAO from "../../src/dataAccess/FollowDAO";
import { IFollow } from "../../src/models/followModel";
import { IUser } from "../../src/models/userModel";
import { IUserProfile } from "../../src/models/userProfile";
import { Types } from "mongoose";
import { ResourceNotFoundError, BadRequestError, ConflictError } from "../../src/utils/errors";
import { ProfileAccess } from "../../src/common/constants";

describe("UserProfileService", () => {
    let userProfileDAO: UserProfileDAO;
    let userProfileService: UserProfileService;
    let followDAO: FollowDAO;

    beforeAll(() => {
        userProfileDAO = jest.requireMock("../../src/dataAccess/UserProfileDAO");
        followDAO = jest.requireMock("../../src/dataAccess/FollowDAO");
        userProfileService = new UserProfileService(userProfileDAO, followDAO);
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("updateUserBio", () => {
        it("should update users bio", async () => {
            const mockUserId = new Types.ObjectId();
            const mockUserBio = "I love codeing!!";
            const mockUser = {
                _id: new Types.ObjectId(),
                userId: mockUserId,
                bio: mockUserBio,
                name: "Ryan Reynolds",
            } as IUserProfile

            const mockFilter = { userId: mockUserId };
            const mockUpdate = { bio: mockUserBio };
            const mockOptions = { new: true };

            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUser);

            await userProfileService.updateUserBio(mockUserId, mockUserBio);

            expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
            expect(userProfileDAO.findOneAndUpdate(mockFilter, mockUpdate, mockOptions)).toEqual(mockUser);
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            const mockUserBio = "I love codeing!!";
            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.updateUserBio(mockUserId, mockUserBio);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User does not exist");
            }
        });
        it("should throw a BadRequestError when users bio is undefined", async () => {
            const mockUserId = new Types.ObjectId();

            try {
                await userProfileService.updateUserBio(mockUserId, null);
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual("Users Bio is Undefined");
            }
        });
    });

    describe("updateUsersFullName", () => {
        it("should update users full name", async () => {
            const mockUserId = new Types.ObjectId();
            const mockName = "Ryan Reynolds";
            const mockUser = {
                _id: new Types.ObjectId(),
                userId: mockUserId,
                bio: "I love codeing!!",
                name: mockName,
            } as IUserProfile

            const mockFilter = { userId: mockUserId };
            const mockUpdate = { name: mockName };
            const mockOptions = { new: true };

            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUser);

            await userProfileService.updateUsersFullName(mockUserId, mockName);

            expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
            expect(userProfileDAO.findOneAndUpdate(mockFilter, mockUpdate, mockOptions)).toEqual(mockUser);
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            const mockName = "Ryan Reynolds";
            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.updateUsersFullName(mockUserId, mockName);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User does not exist");
            }
        });
        it("should throw a BadRequestError when users name is undefined", async () => {
            const mockUserId = new Types.ObjectId();

            try {
                await userProfileService.updateUsersFullName(mockUserId, null);
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual("Users Name is Undefined");
            }
        });
    });

    describe("fetchUserProfile", () => {
        it("should fetch users profile", async () => {
            const mockUserId = new Types.ObjectId();
            const mockUserProfile = {
                _id: new Types.ObjectId(),
                userId: mockUserId,
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
            } as IUserProfile

            userProfileDAO.findOne = jest.fn().mockReturnValue(mockUserProfile);

            await userProfileService.fetchUserProfile(mockUserId);

            expect(userProfileDAO.findOne).toHaveBeenCalledWith({ userId: mockUserId });
            expect(userProfileDAO.findOne({ userId: mockUserId })).toEqual(mockUserProfile);
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            userProfileDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.fetchUserProfile(mockUserId);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });
    });
    describe("followUser", () => {

        it('should follow a user', async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();
        
            followDAO.findOne = jest.fn().mockResolvedValue({ userId: followerId, following: [], followers: [] })
            followDAO.findOne = jest.fn().mockResolvedValue({ userId: followeeId, followers: [], following: [] });

            followDAO.updateOne = jest.fn().mockResolvedValue({ userId: followerId, following: [followeeId], followers: [] });
            followDAO.updateOne = jest.fn().mockResolvedValue({ userId: followeeId, followers: [followerId], following: [] });
        
            await userProfileService.followUser(followerId, followeeId);

            expect(followDAO.findOne).toHaveBeenCalledWith({ userId: followerId });
            expect(followDAO.findOne).toHaveBeenCalledWith({ userId: followeeId });
        
            expect(followDAO.updateOne).toHaveBeenCalledWith(
            { userId: followerId },
            { $addToSet: { following: followeeId } },
            { new: true },
            );
        
            expect(followDAO.updateOne).toHaveBeenCalledWith(
            { userId: followeeId },
            { $addToSet: { followers: followerId } },
            { new: true },
            );
        });

        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockFollowerId = new Types.ObjectId();
            const mockFolloweeId = new Types.ObjectId();
            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.followUser(mockFollowerId, mockFolloweeId);
                expect(followDAO.findOne).toHaveBeenCalledWith({ userId: mockFollowerId });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });

        it("should throw a ResourceNotFoundError when followee does not exist", async () => {
            const mockFollowerId = new Types.ObjectId();
            const mockFolloweeId = new Types.ObjectId();
            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.followUser(mockFollowerId, mockFolloweeId);
                expect(followDAO.findOne).toHaveBeenCalledWith({ userId: mockFolloweeId });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });

        it("should throw a ConflictError when user is already following followee", async () => {
            const mockFollowerId = new Types.ObjectId();
            const mockFolloweeId = new Types.ObjectId();
            followDAO.findOne = jest.fn().mockReturnValue({ userId: mockFollowerId, following: [mockFolloweeId], followers: [] });

            try {
                await userProfileService.followUser(mockFollowerId, mockFolloweeId);
                expect(followDAO.findOne).toHaveBeenCalledWith({ userId: mockFollowerId });
            } catch (error) {
                const err = error as ConflictError;
                expect(err).toBeInstanceOf(ConflictError);
                expect(err.statusCode).toEqual(409);
                expect(err.message).toEqual(`User "${mockFollowerId}" is already following "${mockFolloweeId}"`);
            }
        });

        it("should throw a ConflictError when followee is already following user", async () => {
            const mockFollowerId = new Types.ObjectId();
            const mockFolloweeId = new Types.ObjectId();
            followDAO.findOne = jest.fn().mockReturnValue({ userId: mockFolloweeId, followers: [mockFollowerId], following: [] });

            try {
                await userProfileService.followUser(mockFollowerId, mockFolloweeId);
                expect(followDAO.findOne).toHaveBeenCalledWith({ userId: mockFolloweeId });
            } catch (error) {
                const err = error as ConflictError;
                expect(err).toBeInstanceOf(ConflictError);
                expect(err.statusCode).toEqual(409);
                expect(err.message).toEqual(`User "${mockFolloweeId}" already follows "${mockFollowerId}"`);
            }
        });
    });

    describe("getFollowers", () => {
        it("should return a list of users that are following the user", async () => {
            const mockUserId = new Types.ObjectId();
            const mockFollowers = [
                {
                    _id: new Types.ObjectId(),
                    userId: new Types.ObjectId(),
                    username: "username1",
                    name: "name1",
                    bio: "bio1",
                    accountType: "1"
                },
                {
                    _id: new Types.ObjectId(),
                    userId: new Types.ObjectId(),
                    username: "username2",
                    name: "name2",
                    bio: "bio2",
                    accountType: "1"
                }
            ];
    
            followDAO.getFollowers = jest.fn().mockResolvedValue(mockFollowers);
    
            const followers = await userProfileService.getFollowers(mockUserId);
    
            expect(followers).toEqual(mockFollowers);
            expect(followDAO.getFollowers).toHaveBeenCalledWith(mockUserId);
        });

        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            followDAO.getFollowers = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.getFollowers(mockUserId);
                expect(followDAO.getFollowers).toHaveBeenCalledWith(mockUserId);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });
    });

    describe("getFollowing", () => {
        it("should return a list of users that the user is following", async () => {
            const mockUserId = new Types.ObjectId();
            const mockFollowing = [
                {
                    _id: new Types.ObjectId(),
                    userId: new Types.ObjectId(),
                    username: "username1",
                    name: "name1",
                    bio: "bio1",
                    accountType: "1"
                },
                {
                    _id: new Types.ObjectId(),
                    userId: new Types.ObjectId(),
                    username: "username2",
                    name: "name2",
                    bio: "bio2",
                    accountType: "1"
                }
            ];
    
            followDAO.getFollowing = jest.fn().mockResolvedValue(mockFollowing);
    
            const following = await userProfileService.getFollowing(mockUserId);
    
            expect(following).toEqual(mockFollowing);
            expect(followDAO.getFollowing).toHaveBeenCalledWith(mockUserId);
        });

        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            followDAO.getFollowing = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.getFollowing(mockUserId);
                expect(followDAO.getFollowing).toHaveBeenCalledWith(mockUserId);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });
    });   

    describe("updateAccountType", () => {
        it("should update users account type to private", async () => {
            const mockUserId = new Types.ObjectId();
            const mockAccountType = 2;
            const mockUserProfile = {
                _id: new Types.ObjectId(),
                userId: mockUserId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: mockAccountType
            } as Partial<IUserProfile>

            const mockFilter = { userId: mockUserId };
            const mockUpdate = { accountType: mockAccountType };
            const mockOptions = { new: true };

            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(mockUserProfile);

            await userProfileService.updateAccountType(mockUserId, mockAccountType);

            expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
            expect(userProfileDAO.findOneAndUpdate(mockFilter, mockUpdate, mockOptions)).toEqual(mockUserProfile);
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            const mockAccountType = 2;
            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.updateAccountType(mockUserId, mockAccountType);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User does not exist");
            }
        });
        it("should throw a BadRequestError when users account type is undefined", async () => {
            const mockUserId = new Types.ObjectId();

            try {
                await userProfileService.updateAccountType(mockUserId, null);
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual("Account Type is Undefined");
            }
        });
    });

    describe("requestToFollowUser", () => {
        it("should request to follow a users private account", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Private
            } as Partial<IUserProfile>

            const mockFollow = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [followerId]
            } as Partial<IFollow>

            const mockFilter = { userId: followeeId };
            const mockUpdate = { $addToSet: { requests: followerId } };
            const mockOptions = { new: true };

            userProfileDAO.findById = jest.fn().mockResolvedValue(mockUserProfile);
            followDAO.updateOne = jest.fn().mockResolvedValue(mockFollow);

            await userProfileService.requestToFollowUser(followerId, followeeId);

            expect(followDAO.updateOne).toHaveBeenCalledWith(mockFilter, mockUpdate, mockOptions);
        });

        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.requestToFollowUser(followerId, followeeId);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });

        it("should throw a BadRequestError when users account type is not private", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Public
            } as Partial<IUserProfile>

            userProfileDAO.findById = jest.fn().mockResolvedValue(mockUserProfile);

            try {
                await userProfileService.requestToFollowUser(followerId, followeeId);
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual("User's account is not private");
            }
        });
    });
});