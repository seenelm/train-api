import FollowDAO from "../../src/dataAccess/FollowDAO";
import { Types } from "mongoose";
import { IFollow, FollowModel } from "../../src/models/followModel";
import { IUserProfile } from "../../src/models/userProfile";

describe("FollowDAO", () => {
    let followDAO: FollowDAO;

    beforeAll(() => {
        followDAO = new FollowDAO(FollowModel);
        jest.mock("../../src/models/followModel");
    });

    beforeEach(() => {
        jest.resetAllMocks();
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

            FollowModel.aggregate = jest.fn().mockResolvedValue(mockFollowing);
            // act
            const following = await followDAO.getFollowing(mockUserId);

            // assert
            expect(following).toEqual(mockFollowing);
            expect(FollowModel.aggregate).toHaveBeenCalledWith([
                {
                    $match: {
                        userId: mockUserId
                    }
                },
                {
                    $lookup: {
                        from: "userprofiles",
                        localField: "following",
                        foreignField: "userId",
                        as: "userFollowing"
                    }
                },
                {
                    $unwind: "$userFollowing"
                },
                {
                    $replaceRoot: { newRoot: "$userFollowing" }
                },
                {
                    $project: {
                        _v: 0
                    }
                }
            ]);
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

            FollowModel.aggregate = jest.fn().mockResolvedValue(mockFollowers);
            // act
            const followers = await followDAO.getFollowers(mockUserId);

            // assert
            expect(followers).toEqual(mockFollowers);
            expect(FollowModel.aggregate).toHaveBeenCalledWith([
                {
                    $match: {
                        userId: mockUserId
                    }
                },
                {
                    $lookup: {
                        from: "userprofiles",
                        localField: "followers",
                        foreignField: "userId",
                        as: "userFollowers"
                    }
                },
                {
                    $unwind: "$userFollowers"
                },
                {
                    $replaceRoot: { newRoot: "$userFollowers" }
                },
                {
                    $project: {
                        _v: 0
                    }
                }
            ]);
        });
    });
});