import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { IUserProfile } from "../models/userProfile";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import FollowDAO from "../dataAccess/FollowDAO";
import * as Errors from "../utils/errors";
import { Types } from "mongoose";
import CustomLogger from "../common/logger";
import { ProfileAccess } from "../common/constants";

class UserProfileService {
    private userProfileDAO: UserProfileDAO;
    private followDAO: FollowDAO;
    private userGroupsDAO: UserGroupsDAO;
    private logger: CustomLogger;

    constructor(
        userProfileDAO: UserProfileDAO,
        followDAO: FollowDAO,
        userGroupsDAO: UserGroupsDAO,
    ) {
        this.userProfileDAO = userProfileDAO;
        this.followDAO = followDAO;
        this.userGroupsDAO = userGroupsDAO;
        this.logger = new CustomLogger(this.constructor.name);
    }

    public async fetchUserGroups(userId: Types.ObjectId) {
        const user = await this.userGroupsDAO.findOneUser({ userId }, "groups");
        const userGroups = user.groups;

        console.log("UserGroups: ", userGroups);

        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found");
        }

        this.logger.logInfo(`User "${userId}" Groups: `, userGroups);

        return userGroups;
    }

    public async updateUserProfile(
        userId: Types.ObjectId,
        userBio: string,
        name: string,
        accountType: number,
    ): Promise<void> {
        const user = await this.userProfileDAO.findOneAndUpdate(
            { userId },
            { bio: userBio, name, accountType },
            { new: true },
        );

        this.logger.logInfo("User updated their profile", {
            userId,
            userBio,
            name,
            accountType,
        });

        if (!user) {
            throw new Errors.ResourceNotFoundError("User does not exist", {
                userId,
            });
        }
    }

    public async updateUserBio(
        userId: Types.ObjectId | string,
        userBio: string | null,
    ): Promise<void> {
        if (!userBio) {
            throw new Errors.BadRequestError("Users Bio is Undefined", {
                userBio,
            });
        }

        const user = await this.userProfileDAO.findOneAndUpdate(
            { userId: userId },
            { bio: userBio },
            { new: true },
        );

        this.logger.logInfo("User added a bio", { userId, userBio });

        if (!user) {
            throw new Errors.ResourceNotFoundError("User does not exist", {
                userId,
            });
        }
    }

    public async updateUsersFullName(
        userId: Types.ObjectId | string,
        name: string | null,
    ): Promise<void> {
        if (!name) {
            throw new Errors.BadRequestError("Users Name is Undefined", {
                name,
            });
        }

        const user = await this.userProfileDAO.findOneAndUpdate(
            { userId: userId },
            { name },
            { new: true },
        );

        this.logger.logInfo("User updated their name", { userId, name });

        if (!user) {
            throw new Errors.ResourceNotFoundError("User does not exist", {
                userId,
            });
        }
    }

    public async updateAccountType(
        userId: Types.ObjectId,
        accountType: number | null,
    ): Promise<void> {
        if (!accountType) {
            throw new Errors.BadRequestError("Account Type is Undefined", {
                userId,
                accountType,
            });
        }

        const user = await this.userProfileDAO.findOneAndUpdate(
            { userId: userId },
            { accountType },
            { new: true },
        );

        this.logger.logInfo("User updated their account type", {
            userId,
            accountType,
        });

        if (!user) {
            throw new Errors.ResourceNotFoundError("User does not exist", {
                userId,
            });
        }
    }

    public async fetchUserProfile(
        userId: Types.ObjectId,
    ): Promise<IUserProfile | null> {
        const userProfile = await this.userProfileDAO.findOne({
            userId: userId,
        });

        this.logger.logInfo("User fetched their profile", {
            userId,
            userProfile,
        });

        if (!userProfile) {
            throw new Errors.ResourceNotFoundError("User not found", {
                userId,
            });
        }

        return userProfile;
    }

    public async fetchFollowData(userId: Types.ObjectId) {
        const followData = await this.followDAO.getFollowData(userId);

        if (!followData) {
            throw new Errors.ResourceNotFoundError("User not found", {
                userId,
            });
        }

        this.logger.logInfo("Fetch Follow Data", { followData });

        return followData;
    }
    
    /**
     * Follow a users public account
     * @param followerId
     * @param followeeId id of user to follow
     */
    public async followUser(
        followerId: Types.ObjectId,
        followeeId: Types.ObjectId,
    ) {
        const user = await this.followDAO.findOne({ userId: followerId });

        if (!user) {
            throw new Errors.ResourceNotFoundError("Follower not found", {
                followerId,
            });
        }

        const followee = await this.followDAO.findOne({ userId: followeeId });

        if (!followee) {
            throw new Errors.ResourceNotFoundError("Followee not found", {
                followeeId,
            });
        }

        if (user.following.includes(followeeId)) {
            throw new Errors.ConflictError(
                "Follower is already following Followee",
                {
                    followerId,
                    followeeId,
                    following: user.following,
                },
            );
        }

        if (followee.followers.includes(followerId)) {
            throw new Errors.ConflictError(
                "Followee already follows Follower",
                {
                    followerId,
                    followeeId,
                    followers: followee.followers,
                },
            );
        }

        // Add user to following array.
        await this.followDAO.updateOne(
            { userId: followerId },
            { $addToSet: { following: followeeId } },
            { new: true },
        );

        // Add user to followers array.
        await this.followDAO.updateOne(
            { userId: followeeId },
            { $addToSet: { followers: followerId } },
            { new: true },
        );
    }

    public async getFollowers(userId: Types.ObjectId) {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id");
        }

        const followers = await this.followDAO.getFollowers(userId);

        if (!followers) {
            throw new Errors.ResourceNotFoundError("User not found");
        }

        return followers;
    }

    public async getFollowing(userId: Types.ObjectId) {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id");
        }

        const following = await this.followDAO.getFollowing(userId);

        if (!following) {
            throw new Errors.ResourceNotFoundError("User not found");
        }

        return following;
    }

    /**
     * Request to follow a users private account
     * @param followerId follower id of the user requesting to follow another user
     * @param followeeId followee id of the user being requested to follow
     */
    public async requestToFollowUser(
        followerId: Types.ObjectId,
        followeeId: Types.ObjectId,
    ): Promise<void> {
        // Check if the followeeId exists in the database
        const followee = await this.userProfileDAO.findById(followeeId);
        const follower = await this.userProfileDAO.findById(followerId);

        if (!followee) {
            throw new Errors.ResourceNotFoundError(
                `User ${followeeId} not found`,
            );
        }

        if (!follower) {
            throw new Errors.ResourceNotFoundError(
                `User ${followerId} not found`,
            );
        }

        // Check if the followee's account is private
        if (followee.accountType !== ProfileAccess.Private) {
            throw new Errors.BadRequestError(
                `User ${followee.username}'s account is not private`,
            );
        }

        // Fetch the follow document for the followee
        const followeeFollowDoc = await this.followDAO.findOne({
            userId: followeeId,
        });

        if (!followeeFollowDoc) {
            throw new Errors.ResourceNotFoundError(
                `Follow document for user ${followee.username} not found`,
            );
        }

        // Check if the follower has already requested to follow the followee
        if (followeeFollowDoc.requests.includes(followerId)) {
            throw new Errors.BadRequestError(
                `User ${follower.username} has already requested to follow ${followee.username}`,
            );
        }

        // Check if the follower is already following the followee
        if (followeeFollowDoc.followers.includes(followerId)) {
            throw new Errors.ConflictError(
                `User ${follower.username} is already following ${followee.username}`,
                null,
            );
        }

        // Add the followerId to the followee's requests array
        await this.followDAO.updateOne(
            { userId: followeeId },
            { $addToSet: { requests: followerId } },
            { new: true },
        );
    }

    /**
     * Accept a follow request
     * @param followerId follower id of the user who sent the follow request
     * @param followeeId followee id of the user who accepted the follow request
     */
    public async acceptFollowRequest(
        followerId: Types.ObjectId,
        followeeId: Types.ObjectId,
    ): Promise<void> {
        // Check if the followeeId exists in the database
        const followee = await this.userProfileDAO.findById(followeeId);
        const follower = await this.userProfileDAO.findById(followerId);

        if (!followee) {
            throw new Errors.ResourceNotFoundError(
                `User ${followeeId} not found`,
            );
        }

        if (!follower) {
            throw new Errors.ResourceNotFoundError(
                `User ${followerId} not found`,
            );
        }

        // Check if the followee's account is private
        if (followee.accountType !== ProfileAccess.Private) {
            throw new Errors.BadRequestError(
                `User ${followee.username}'s account is not private`,
            );
        }

        // Fetch the follow document for the followee
        const followeeFollowDoc = await this.followDAO.findOne({
            userId: followeeId,
        });

        if (!followeeFollowDoc) {
            throw new Errors.ResourceNotFoundError(
                `Follow document for user ${followee.username} not found`,
            );
        }

        // Check if the follower has requested to follow the followee
        if (!followeeFollowDoc.requests.includes(followerId)) {
            throw new Errors.BadRequestError(
                `User ${follower.username} has not requested to follow ${followee.username}`,
            );
        }

        // Add the followerId to the followee's followers array
        // Remove the followerId from the followee's requests array
        await this.followDAO.updateOne(
            { userId: followeeId },
            {
                $addToSet: { followers: followerId },
                $pull: { requests: followerId },
            },
            { new: true },
        );

        // Add the followeeId to the follower's following array
        await this.followDAO.updateOne(
            { userId: followerId },
            { $addToSet: { following: followeeId } },
            { new: true },
        );
    }

    public async rejectFollowRequest(
        followerId: Types.ObjectId,
        followeeId: Types.ObjectId,
    ): Promise<void> {
        // Check if the followeeId exists in the database
        const followee = await this.userProfileDAO.findById(followeeId);
        const follower = await this.userProfileDAO.findById(followerId);

        if (!followee) {
            throw new Errors.ResourceNotFoundError(
                `User ${followeeId} not found`,
            );
        }

        if (!follower) {
            throw new Errors.ResourceNotFoundError(
                `User ${followerId} not found`,
            );
        }

        // Check if the followee's account is private
        if (followee.accountType !== ProfileAccess.Private) {
            throw new Errors.BadRequestError(
                `User ${followee.username}'s account is not private`,
            );
        }

        // Fetch the follow document for the followee
        const followeeFollowDoc = await this.followDAO.findOne({
            userId: followeeId,
        });

        if (!followeeFollowDoc) {
            throw new Errors.ResourceNotFoundError(
                `Follow document for user ${followee.username} not found`,
            );
        }

        // Check if the follower has requested to follow the followee
        if (!followeeFollowDoc.requests.includes(followerId)) {
            throw new Errors.BadRequestError(
                `User ${follower.username} has not requested to follow ${followee.username}`,
            );
        }

        // Remove the followerId from the followee's requests array
        await this.followDAO.updateOne(
            { userId: followeeId },
            { $pull: { requests: followerId } },
            { new: true },
        );
    }

    public async removeFollower(
        followerId: Types.ObjectId,
        followeeId: Types.ObjectId,
    ): Promise<void> {
        // Check if the followeeId exists in the database
        const followee = await this.userProfileDAO.findById(followeeId);
        const follower = await this.userProfileDAO.findById(followerId);

        if (!followee) {
            throw new Errors.ResourceNotFoundError(
                `User ${followeeId} not found`,
            );
        }

        if (!follower) {
            throw new Errors.ResourceNotFoundError(
                `User ${followerId} not found`,
            );
        }

        // Fetch the follow document for the followee
        const followeeFollowDoc = await this.followDAO.findOne({
            userId: followeeId,
        });

        if (!followeeFollowDoc) {
            throw new Errors.ResourceNotFoundError(
                `Follow document for user ${followee.username} not found`,
            );
        }

        // Check if the follower is following the followee
        if (!followeeFollowDoc.followers.includes(followerId)) {
            throw new Errors.BadRequestError(
                `User ${follower.username} is not following ${followee.username}`,
            );
        }

        // Remove the followerId from the followee's followers array
        await this.followDAO.updateOne(
            { userId: followeeId },
            { $pull: { followers: followerId } },
            { new: true },
        );

        // Remove the followeeId from the follower's following array
        await this.followDAO.updateOne(
            { userId: followerId },
            { $pull: { following: followeeId } },
            { new: true },
        );
    }

    public async unfollowUser(
        followerId: Types.ObjectId,
        followeeId: Types.ObjectId,
    ): Promise<void> {
        const followee = await this.userProfileDAO.findById(followeeId);
        const follower = await this.userProfileDAO.findById(followerId);

        if (!followee) {
            throw new Errors.ResourceNotFoundError(
                `User ${followeeId} not found`,
            );
        }

        if (!follower) {
            throw new Errors.ResourceNotFoundError(
                `User ${followerId} not found`,
            );
        }

        // Fetch the follow document for the followee
        const followerFollowDoc = await this.followDAO.findOne({
            userId: followerId,
        });

        if (!followerFollowDoc) {
            throw new Errors.ResourceNotFoundError(
                `Follow document for user ${follower.username} not found`,
            );
        }

        // Check if the follower is following the followee
        if (!followerFollowDoc.following.includes(followeeId)) {
            throw new Errors.BadRequestError(
                `User ${follower.username} is not following ${followee.username}`,
            );
        }

        // Remove the followeeId from the follower's following array
        await this.followDAO.updateOne(
            { userId: followerId },
            { $pull: { following: followeeId } },
            { new: true },
        );

        // Remove the followerId from the followee's followers array
        await this.followDAO.updateOne(
            { userId: followeeId },
            { $pull: { followers: followerId } },
            { new: true },
        );
    }
}

export default UserProfileService;
