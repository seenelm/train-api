import UserProfileDAO from "../../src/dataAccess/UserProfileDAO";
import UserProfileService from "../../src/services/UserProfileService";
import FollowDAO from "../../src/dataAccess/FollowDAO";
import UserGroupsDAO from "../../src/dataAccess/UserGroupsDAO";
import { IFollow } from "../../src/models/followModel";
import { IUser } from "../../src/models/userModel";
import { IUserProfile } from "../../src/models/userProfile";
import { Types } from "mongoose";
import {
    ResourceNotFoundError,
    BadRequestError,
    ConflictError,
} from "../../src/utils/errors";
import { ProfileAccess } from "../../src/common/constants";
import { IGroup } from "../../src/models/groupModel";
import { IUserGroups } from "../../src/models/userGroups";

describe("UserProfileService", () => {
    let userProfileDAO: UserProfileDAO;
    let userProfileService: UserProfileService;
    let followDAO: FollowDAO;
    let userGroupsDAO: UserGroupsDAO;

    beforeAll(() => {
        userProfileDAO = jest.requireMock(
            "../../src/dataAccess/UserProfileDAO",
        );
        followDAO = jest.requireMock("../../src/dataAccess/FollowDAO");
        userGroupsDAO = jest.requireMock("../../src/dataAccess/UserGroupsDAO");
        userProfileService = new UserProfileService(
            userProfileDAO,
            followDAO,
            userGroupsDAO,
        );
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("fetchUserGroups", () => {
        it("should fetch users groups", async () => {
            const mockUserId = new Types.ObjectId();

            const mockGroupOne: Partial<IGroup> = {
                _id: new Types.ObjectId(),
                groupName: "Group 1",
                bio: "Group 1 description",
                owners: [mockUserId],
                users: [],
                requests: [],
                accountType: ProfileAccess.Public,
            };

            const mockGroupTwo: Partial<IGroup> = {
                _id: new Types.ObjectId(),
                groupName: "Group 2",
                bio: "Group 2 description",
                owners: [mockUserId],
                users: [],
                requests: [],
                accountType: ProfileAccess.Public,
            };

            const mockUserGroups: Partial<IUserGroups> = {
                _id: new Types.ObjectId(),
                userId: mockUserId,
                groups: [mockGroupOne._id, mockGroupTwo._id],
            };

            userGroupsDAO.findOneAndPopulate = jest
                .fn()
                .mockReturnValue(mockUserGroups);

            const userGroups =
                await userProfileService.fetchUserGroups(mockUserId);

            expect(userGroups).toEqual(mockUserGroups.groups);
            expect(userGroupsDAO.findOneAndPopulate).toHaveBeenCalledWith(
                {
                    userId: mockUserId,
                },
                "groups",
            );
        });

        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            userGroupsDAO.findOneAndPopulate = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.fetchUserGroups(mockUserId);
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User not found");
            }
        });
    });

    // Check
    describe("updateUserProfile", () => {
        it("should update users profile", async () => {
            const mockUserId = new Types.ObjectId();
            const mockUserBio = "I love codeing!!";
            const mockName = "Ryan Reynolds";
            const mockAccountType = ProfileAccess.Private;

            const mockUserProfile = {
                _id: new Types.ObjectId(),
                userId: mockUserId,
                username: "username1",
                bio: mockUserBio,
                name: mockName,
                accountType: mockAccountType,
            } as Partial<IUserProfile>;

            const mockFilter = { userId: mockUserId };
            const mockUpdate = {
                bio: mockUserBio,
                name: mockName,
                accountType: mockAccountType,
            };
            const mockOptions = { new: true };

            userProfileDAO.findOneAndUpdate = jest
                .fn()
                .mockReturnValue(mockUserProfile);

            await userProfileService.updateUserProfile(
                mockUserId,
                mockUserBio,
                mockName,
                mockAccountType,
            );

            expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
            expect(
                userProfileDAO.findOneAndUpdate(
                    mockFilter,
                    mockUpdate,
                    mockOptions,
                ),
            ).toEqual(mockUserProfile);
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            const mockUserBio = "I love codeing!!";
            const mockName = "Ryan Reynolds";
            const mockAccountType = ProfileAccess.Private;
            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.updateUserProfile(
                    mockUserId,
                    mockUserBio,
                    mockName,
                    mockAccountType,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual("User does not exist");
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
            } as IUserProfile;

            userProfileDAO.findOne = jest.fn().mockReturnValue(mockUserProfile);

            await userProfileService.fetchUserProfile(mockUserId);

            expect(userProfileDAO.findOne).toHaveBeenCalledWith({
                userId: mockUserId,
            });
            expect(userProfileDAO.findOne({ userId: mockUserId })).toEqual(
                mockUserProfile,
            );
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
        it("should follow a user", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            followDAO.findOne = jest.fn().mockResolvedValue({
                userId: followerId,
                following: [],
                followers: [],
            });
            followDAO.findOne = jest.fn().mockResolvedValue({
                userId: followeeId,
                followers: [],
                following: [],
            });

            followDAO.updateOne = jest.fn().mockResolvedValue({
                userId: followerId,
                following: [followeeId],
                followers: [],
            });
            followDAO.updateOne = jest.fn().mockResolvedValue({
                userId: followeeId,
                followers: [followerId],
                following: [],
            });

            await userProfileService.followUser(followerId, followeeId);

            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followerId,
            });
            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followeeId,
            });

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
                await userProfileService.followUser(
                    mockFollowerId,
                    mockFolloweeId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: mockFollowerId,
                });
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
                await userProfileService.followUser(
                    mockFollowerId,
                    mockFolloweeId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: mockFolloweeId,
                });
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
            followDAO.findOne = jest.fn().mockReturnValue({
                userId: mockFollowerId,
                following: [mockFolloweeId],
                followers: [],
            });

            try {
                await userProfileService.followUser(
                    mockFollowerId,
                    mockFolloweeId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: mockFollowerId,
                });
            } catch (error) {
                const err = error as ConflictError;
                expect(err).toBeInstanceOf(ConflictError);
                expect(err.statusCode).toEqual(409);
                expect(err.message).toEqual(
                    `User "${mockFollowerId}" is already following "${mockFolloweeId}"`,
                );
            }
        });

        it("should throw a ConflictError when followee is already following user", async () => {
            const mockFollowerId = new Types.ObjectId();
            const mockFolloweeId = new Types.ObjectId();
            followDAO.findOne = jest.fn().mockReturnValue({
                userId: mockFolloweeId,
                followers: [mockFollowerId],
                following: [],
            });

            try {
                await userProfileService.followUser(
                    mockFollowerId,
                    mockFolloweeId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: mockFolloweeId,
                });
            } catch (error) {
                const err = error as ConflictError;
                expect(err).toBeInstanceOf(ConflictError);
                expect(err.statusCode).toEqual(409);
                expect(err.message).toEqual(
                    `User "${mockFolloweeId}" already follows "${mockFollowerId}"`,
                );
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
                    accountType: "1",
                },
                {
                    _id: new Types.ObjectId(),
                    userId: new Types.ObjectId(),
                    username: "username2",
                    name: "name2",
                    bio: "bio2",
                    accountType: "1",
                },
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
                    accountType: "1",
                },
                {
                    _id: new Types.ObjectId(),
                    userId: new Types.ObjectId(),
                    username: "username2",
                    name: "name2",
                    bio: "bio2",
                    accountType: "1",
                },
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
                accountType: mockAccountType,
            } as Partial<IUserProfile>;

            const mockFilter = { userId: mockUserId };
            const mockUpdate = { accountType: mockAccountType };
            const mockOptions = { new: true };

            userProfileDAO.findOneAndUpdate = jest
                .fn()
                .mockReturnValue(mockUserProfile);

            await userProfileService.updateAccountType(
                mockUserId,
                mockAccountType,
            );

            expect(userProfileDAO.findOneAndUpdate).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
            expect(
                userProfileDAO.findOneAndUpdate(
                    mockFilter,
                    mockUpdate,
                    mockOptions,
                ),
            ).toEqual(mockUserProfile);
        });
        it("should throw a ResourceNotFoundError when user does not exist", async () => {
            const mockUserId = new Types.ObjectId();
            const mockAccountType = 2;
            userProfileDAO.findOneAndUpdate = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.updateAccountType(
                    mockUserId,
                    mockAccountType,
                );
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

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFollow = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [followerId],
            } as Partial<IFollow>;

            const mockFilter = { userId: followeeId };
            const mockUpdate = { $addToSet: { requests: followerId } };
            const mockOptions = { new: true };

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);
            followDAO.updateOne = jest.fn().mockResolvedValue(mockFollow);

            await userProfileService.requestToFollowUser(
                followerId,
                followeeId,
            );

            expect(userProfileDAO.findById).toHaveBeenCalledWith(followerId);
            expect(userProfileDAO.findById).toHaveBeenCalledWith(followeeId);
            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followeeId,
            });
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
        });

        it("should throw a ResourceNotFoundError when followee does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.requestToFollowUser(
                    followerId,
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followeeId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when follower does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followeeId)) {
                    return {
                        _id: followeeId,
                        username: "followee",
                        bio: "I love coding!",
                        name: "Followee User",
                        accountType: ProfileAccess.Private,
                    };
                } else {
                    return null;
                }
            });

            try {
                await userProfileService.requestToFollowUser(
                    followerId,
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followerId} not found`);
            }
        });

        it("should throw a BadRequestError when users account type is not private", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            try {
                await userProfileService.requestToFollowUser(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFolloweeUserProfile.username}'s account is not private`,
                );
            }
        });

        it("should throw a ResourceNotFoundError when followee follow document does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest
                .fn()
                .mockResolvedValue(mockFolloweeUserProfile);
            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.requestToFollowUser(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(
                    `Follow document for user ${mockFolloweeUserProfile.username} not found`,
                );
            }
        });

        it("should throw a BadRequestError when user already requested to follow followee", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFollow = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [followerId],
            } as Partial<IFollow>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest.fn().mockResolvedValue(mockFollow);

            try {
                await userProfileService.requestToFollowUser(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFollowerUserProfile.username} has already requested to follow ${mockFolloweeUserProfile.username}`,
                );
            }
        });
    });

    describe("acceptFollowRequest", () => {
        it("should accept a follow request", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [followerId],
            } as Partial<IFollow>;

            const mockUpdatedFolloweeFollowDoc = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [followerId],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFollowerFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followerId,
                followers: [],
                following: [followeeId],
                requests: [],
            } as Partial<IFollow>;

            const mockFilter = { userId: followeeId };
            const mockUpdate = {
                $addToSet: { followers: followerId },
                $pull: { requests: followerId },
            };
            const mockOptions = { new: true };

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);

            followDAO.updateOne = jest
                .fn()
                .mockImplementation((filter, update, options) => {
                    if (filter.userId.equals(followeeId)) {
                        return mockUpdatedFolloweeFollowDoc;
                    } else if (filter.userId.equals(followerId)) {
                        return mockFollowerFollowDocument;
                    }
                });

            await userProfileService.acceptFollowRequest(
                followerId,
                followeeId,
            );

            expect(userProfileDAO.findById).toHaveBeenCalledWith(followerId);
            expect(userProfileDAO.findById).toHaveBeenCalledWith(followeeId);
            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followeeId,
            });

            expect(followDAO.updateOne).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                { userId: followerId },
                { $addToSet: { following: followeeId } },
                { new: true },
            );
        });

        it("should throw a ResourceNotFoundError when followee does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.acceptFollowRequest(
                    followerId,
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followeeId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when follower does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followeeId)) {
                    return {
                        _id: followeeId,
                        username: "followee",
                        bio: "I love coding!",
                        name: "Followee User",
                        accountType: ProfileAccess.Private,
                    };
                } else {
                    return null;
                }
            });

            try {
                await userProfileService.acceptFollowRequest(
                    followerId,
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followerId} not found`);
            }
        });

        it("should throw a BadRequestError when followee account type is not private", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            try {
                await userProfileService.acceptFollowRequest(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFolloweeUserProfile.username}'s account is not private`,
                );
            }
        });

        it("should throw a ResourceNotFoundError when followee follow document does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest
                .fn()
                .mockResolvedValue(mockFolloweeUserProfile);
            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.acceptFollowRequest(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(
                    `Follow document for user ${mockFolloweeUserProfile.username} not found`,
                );
            }
        });

        it("should throw a BadRequestError when the follower has not requested to follow the followee", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);

            try {
                await userProfileService.acceptFollowRequest(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFollowerUserProfile.username} has not requested to follow ${mockFolloweeUserProfile.username}`,
                );
            }
        });
    });

    describe("rejectFollowRequest", () => {
        it("should reject a follow request", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [followerId],
            } as Partial<IFollow>;

            const mockUpdatedFolloweeFollowDoc = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFilter = { userId: followeeId };
            const mockUpdate = { $pull: { requests: followerId } };
            const mockOptions = { new: true };

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);

            followDAO.updateOne = jest
                .fn()
                .mockResolvedValue(mockUpdatedFolloweeFollowDoc);

            await userProfileService.rejectFollowRequest(
                followerId,
                followeeId,
            );

            expect(userProfileDAO.findById).toHaveBeenCalledWith(followerId);
            expect(userProfileDAO.findById).toHaveBeenCalledWith(followeeId);
            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followeeId,
            });
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
        });

        it("should throw a ResourceNotFoundError when followee does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.rejectFollowRequest(
                    followerId,
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followeeId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when follower does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followeeId)) {
                    return {
                        _id: followeeId,
                        username: "followee",
                        bio: "I love coding!",
                        name: "Followee User",
                        accountType: ProfileAccess.Private,
                    };
                } else {
                    return null;
                }
            });

            try {
                await userProfileService.rejectFollowRequest(
                    followerId,
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followerId} not found`);
            }
        });

        it("should throw a BadRequestError when followee account type is not private", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            try {
                await userProfileService.rejectFollowRequest(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFolloweeUserProfile.username}'s account is not private`,
                );
            }
        });

        it("should throw a ResourceNotFoundError when followee follow document does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.rejectFollowRequest(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(
                    `Follow document for user ${mockFolloweeUserProfile.username} not found`,
                );
            }
        });

        it("should throw a BadRequestError when the follower has not requested to follow the followee", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);

            try {
                await userProfileService.rejectFollowRequest(
                    followerId,
                    followeeId,
                );

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFollowerUserProfile.username} has not requested to follow ${mockFolloweeUserProfile.username}`,
                );
            }
        });
    });

    describe("removeFollower", () => {
        it("should remove a follower", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [followerId],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFollowerFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followerId,
                followers: [],
                following: [followeeId],
                requests: [],
            } as Partial<IFollow>;

            const mockUpdatedFolloweeFollowDoc = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockUpdatedFollowerFollowDoc = {
                _id: new Types.ObjectId(),
                userId: followerId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFilter = { userId: followeeId };
            const mockUpdate = { $pull: { followers: followerId } };
            const mockOptions = { new: true };

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);

            followDAO.updateOne = jest
                .fn()
                .mockImplementation((filter, update, options) => {
                    if (filter.userId.equals(followeeId)) {
                        return mockUpdatedFolloweeFollowDoc;
                    } else if (filter.userId.equals(followerId)) {
                        return mockUpdatedFollowerFollowDoc;
                    }
                });

            await userProfileService.removeFollower(followerId, followeeId);

            expect(userProfileDAO.findById).toHaveBeenCalledWith(followerId);
            expect(userProfileDAO.findById).toHaveBeenCalledWith(followeeId);
            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followeeId,
            });
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                { userId: followerId },
                { $pull: { following: followeeId } },
                { new: true },
            );
        });

        it("should throw a ResourceNotFoundError when followee does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.removeFollower(followerId, followeeId);
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followeeId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when follower does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followeeId)) {
                    return {
                        _id: followeeId,
                        username: "followee",
                        bio: "I love coding!",
                        name: "Followee User",
                        accountType: ProfileAccess.Private,
                    };
                } else {
                    return null;
                }
            });

            try {
                await userProfileService.removeFollower(followerId, followeeId);
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followerId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when followee follow document does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.removeFollower(followerId, followeeId);

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(
                    `Follow document for user ${mockFolloweeUserProfile.username} not found`,
                );
            }
        });

        it("should throw a BadRequestError when the follower is not following the followee", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFolloweeFollowDocument);

            try {
                await userProfileService.removeFollower(followerId, followeeId);

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followeeId,
                });
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFollowerUserProfile.username} is not following ${mockFolloweeUserProfile.username}`,
                );
            }
        });
    });

    describe("unfollowUser", () => {
        it("should unfollow a user", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [followerId],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFollowerFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followerId,
                followers: [],
                following: [followeeId],
                requests: [],
            } as Partial<IFollow>;

            const mockUpdatedFolloweeFollowDoc = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockUpdatedFollowerFollowDoc = {
                _id: new Types.ObjectId(),
                userId: followerId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            const mockFilter = { userId: followerId };
            const mockUpdate = { $pull: { following: followeeId } };
            const mockOptions = { new: true };

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFollowerFollowDocument);

            followDAO.updateOne = jest
                .fn()
                .mockImplementation((filter, update, options) => {
                    if (filter.userId.equals(followeeId)) {
                        return mockUpdatedFolloweeFollowDoc;
                    } else if (filter.userId.equals(followerId)) {
                        return mockUpdatedFollowerFollowDoc;
                    }
                });

            await userProfileService.unfollowUser(followerId, followeeId);

            expect(userProfileDAO.findById).toHaveBeenCalledWith(followerId);
            expect(userProfileDAO.findById).toHaveBeenCalledWith(followeeId);
            expect(followDAO.findOne).toHaveBeenCalledWith({
                userId: followerId,
            });
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                mockFilter,
                mockUpdate,
                mockOptions,
            );
            expect(followDAO.updateOne).toHaveBeenCalledWith(
                { userId: followeeId },
                { $pull: { followers: followerId } },
                { new: true },
            );
        });

        it("should throw a ResourceNotFoundError when followee does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.unfollowUser(followerId, followeeId);
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followeeId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when follower does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followeeId)) {
                    return {
                        _id: followeeId,
                        username: "followee",
                        bio: "I love coding!",
                        name: "Followee User",
                        accountType: ProfileAccess.Private,
                    };
                } else {
                    return null;
                }
            });

            try {
                await userProfileService.unfollowUser(followerId, followeeId);
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(`User ${followerId} not found`);
            }
        });

        it("should throw a ResourceNotFoundError when follower follow document does not exist", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username1",
                bio: "I love codeing!!",
                name: "Ryan Reynolds",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Private,
            } as Partial<IUserProfile>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest.fn().mockReturnValue(null);

            try {
                await userProfileService.unfollowUser(followerId, followeeId);

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followerId,
                });
            } catch (error) {
                const err = error as ResourceNotFoundError;
                expect(err).toBeInstanceOf(ResourceNotFoundError);
                expect(err.statusCode).toEqual(404);
                expect(err.message).toEqual(
                    `Follow document for user ${mockFollowerUserProfile.username} not found`,
                );
            }
        });

        it("should throw a BadRequestError when the follower is not following the followee", async () => {
            const followerId = new Types.ObjectId();
            const followeeId = new Types.ObjectId();

            const mockFollowerUserProfile = {
                _id: new Types.ObjectId(),
                userId: followerId,
                username: "username1",
                bio: "I love codeing!!",
                name: "name1",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFolloweeUserProfile = {
                _id: new Types.ObjectId(),
                userId: followeeId,
                username: "username2",
                bio: "I love codeing!!",
                name: "name2",
                accountType: ProfileAccess.Public,
            } as Partial<IUserProfile>;

            const mockFollowerFollowDocument = {
                _id: new Types.ObjectId(),
                userId: followerId,
                followers: [],
                following: [],
                requests: [],
            } as Partial<IFollow>;

            userProfileDAO.findById = jest.fn().mockImplementation((id) => {
                if (id.equals(followerId)) {
                    return mockFollowerUserProfile;
                } else if (id.equals(followeeId)) {
                    return mockFolloweeUserProfile;
                }
            });

            followDAO.findOne = jest
                .fn()
                .mockResolvedValue(mockFollowerFollowDocument);

            try {
                await userProfileService.unfollowUser(followerId, followeeId);

                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followeeId,
                );
                expect(userProfileDAO.findById).toHaveBeenCalledWith(
                    followerId,
                );
                expect(followDAO.findOne).toHaveBeenCalledWith({
                    userId: followerId,
                });
            } catch (error) {
                const err = error as BadRequestError;
                expect(err).toBeInstanceOf(BadRequestError);
                expect(err.statusCode).toEqual(400);
                expect(err.message).toEqual(
                    `User ${mockFollowerUserProfile.username} is not following ${mockFolloweeUserProfile.username}`,
                );
            }
        });
    });
});
