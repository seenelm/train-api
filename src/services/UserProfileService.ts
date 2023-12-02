import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { IUserProfile, UserProfileModel } from "../models/userProfile";
import { IFollow, FollowModel } from "../models/followModel";
import FollowDAO from "../dataAccess/FollowDAO";
import * as Errors from "../utils/errors";
import { Types } from "mongoose";
import logger from "../common/logger";
import { ProfileAccess } from "../common/constants";

class UserProfileService {
    private userProfileDAO: UserProfileDAO;
    private followDAO: FollowDAO;

    constructor(userProfileDAO: UserProfileDAO, followDAO: FollowDAO) {
      // this.userProfileDAO = new UserProfileDAO(UserProfileModel);
      // this.followDAO = new FollowDAO(FollowModel);
      this.userProfileDAO = userProfileDAO;
      this.followDAO = followDAO;
    }

    public async updateUserBio(userId: Types.ObjectId | string, userBio: string | null): Promise<void> {
    
        if (!userBio) {
          throw new Errors.BadRequestError("Users Bio is Undefined");
        }
    
        const user = await this.userProfileDAO.findOneAndUpdate(
          {userId: userId}, 
          { bio: userBio }, 
          { new: true }
        );

        logger.info(`User ${userId} added a bio: `, user);
    
        if (!user) {
          throw new Errors.ResourceNotFoundError("User does not exist");
        }
      }
    
    public async updateUsersFullName(userId: Types.ObjectId | string, name: string | null): Promise<void> {
      
      if (!name) {
        throw new Errors.BadRequestError("Users Name is Undefined");
      }
  
      const user = await this.userProfileDAO.findOneAndUpdate(
        {userId: userId}, 
        { name }, 
        { new: true }
      );

      logger.info(`User ${userId} updated name: `, user);
  
      if (!user) {
        throw new Errors.ResourceNotFoundError("User does not exist");
      }
    }

    public async updateAccountType(userId: Types.ObjectId, accountType: number | null): Promise<void> {
        
        if (!accountType) {
          throw new Errors.BadRequestError("Account Type is Undefined");
        }
    
        const user = await this.userProfileDAO.findOneAndUpdate(
          {userId: userId}, 
          { accountType }, 
          { new: true }
        );
  
        logger.info(`User ${userId} updated account type: `, user);
    
        if (!user) {
          throw new Errors.ResourceNotFoundError("User does not exist");
        }
    }

    public async fetchUserProfile(userId: Types.ObjectId): Promise<IUserProfile | null> {
      const userProfile = await this.userProfileDAO.findOne({ userId: userId });

      logger.info(`User "${userId}" profile: `, userProfile);

      if (!userProfile) {
        throw new Errors.ResourceNotFoundError("User not found");
      }

      return userProfile;
    }

    /**
     * Follow a users public account
     * @param followerId 
     * @param followeeId id of user to follow
     */
    public async followUser(followerId: Types.ObjectId, followeeId: Types.ObjectId) {

      const user = await this.followDAO.findOne({ userId: followerId });

      if (!user) {
        throw new Errors.ResourceNotFoundError("User not found");
      }

      const followee = await this.followDAO.findOne({ userId: followeeId });

      if (!followee) {
        throw new Errors.ResourceNotFoundError("User not found");
      }

      if (user.following.includes(followeeId)) {
        logger.error(`User "${followerId}" is already following "${followeeId}"`);
        throw new Errors.ConflictError(`User "${followerId}" is already following "${followeeId}"`, null);
      }

      if (followee.followers.includes(followerId)) {
        logger.error(`User "${followeeId}" already follows "${followerId}"`);
        throw new Errors.ConflictError(`User "${followeeId}" already follows "${followerId}"`, null);
      }

      // Add user to following array.
      await this.followDAO.updateOne(
        { userId: followerId },
        { $addToSet: { following: followeeId } },
        { new: true},
      );
      logger.info(`User "${followerId}" is following "${followeeId}"`);

      // Add user to followers array.
      await this.followDAO.updateOne(
        { userId: followeeId },
        { $addToSet: { followers: followerId } },
        { new: true},
      );
      logger.info(`User "${followeeId}" has a new follower, "${followerId}"`);
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
    public async requestToFollowUser(followerId: Types.ObjectId, followeeId: Types.ObjectId): Promise<void> {
      // Check if the followeeId exists in the database
      const followee = await this.userProfileDAO.findById(followeeId);
      const follower = await this.userProfileDAO.findById(followerId);

      if (!followee) {
        throw new Errors.ResourceNotFoundError(`User ${followeeId} not found`);
      }

      if (!follower) {
        throw new Errors.ResourceNotFoundError(`User ${followerId} not found`);
      }

       // Check if the followee's account is private
       if (followee.accountType !== ProfileAccess.Private) {
        throw new Errors.BadRequestError(`User ${followee.username}'s account is not private`);
      }

      // Fetch the follow document for the followee
      const followeeFollowDoc = await this.followDAO.findOne({ userId: followeeId });

      if (!followeeFollowDoc) {
        throw new Errors.ResourceNotFoundError(`Follow document for user ${followee.username} not found`);
      }

      // Check if the follower has already requested to follow the followee
      if (followeeFollowDoc.requests.includes(followerId)) {
        throw new Errors.BadRequestError(`User ${follower.username} has already requested to follow ${followee.username}`);
      }

      // Check if the follower is already following the followee
      if (followeeFollowDoc.followers.includes(followerId)) {
        throw new Errors.ConflictError(`User ${follower.username} is already following ${followee.username}`, null);
      }
  
      // Add the followerId to the followee's requests array
      await this.followDAO.updateOne(
          { userId: followeeId },
          { $addToSet: { requests: followerId } },
          { new: true},
      );
  }

  /**
   * Accept a follow request
   * @param followerId follower id of the user who sent the follow request
   * @param followeeId followee id of the user who accepted the follow request
   */
  public async acceptFollowRequest(followerId: Types.ObjectId, followeeId: Types.ObjectId): Promise<void> {
    // Check if the followeeId exists in the database
    const followee = await this.userProfileDAO.findById(followeeId);
    const follower = await this.userProfileDAO.findById(followerId);

    if (!followee) {
      throw new Errors.ResourceNotFoundError(`User ${followeeId} not found`);
    }

    if (!follower) {
      throw new Errors.ResourceNotFoundError(`User ${followerId} not found`);
    }

    // Check if the followee's account is private
    if (followee.accountType !== ProfileAccess.Private) {
      throw new Errors.BadRequestError(`User ${followee.username}'s account is not private`);
    }

    // Fetch the follow document for the followee
    const followeeFollowDoc = await this.followDAO.findOne({ userId: followeeId });

    if (!followeeFollowDoc) {
      throw new Errors.ResourceNotFoundError(`Follow document for user ${followee.username} not found`);
    }

    // Check if the follower has requested to follow the followee
    if (!followeeFollowDoc.requests.includes(followerId)) {
      throw new Errors.BadRequestError(`User ${follower.username} has not requested to follow ${followee.username}`);
    }

    // Add the followerId to the followee's followers array
    // Remove the followerId from the followee's requests array
    await this.followDAO.updateOne(
        { userId: followeeId },
        { 
          $addToSet: { followers: followerId },
          $pull: { requests: followerId }
        },
        { new: true},
    );

    // Add the followeeId to the follower's following array
    await this.followDAO.updateOne(
      { userId: followerId },
      { $addToSet: { following: followeeId } },
      { new: true},
    );
  }

  public async rejectFollowRequest(followerId: Types.ObjectId, followeeId: Types.ObjectId): Promise<void> {
    // Check if the followeeId exists in the database
    const followee = await this.userProfileDAO.findById(followeeId);
    const follower = await this.userProfileDAO.findById(followerId);

    if (!followee) {
      throw new Errors.ResourceNotFoundError(`User ${followeeId} not found`);
    }

    if (!follower) {
      throw new Errors.ResourceNotFoundError(`User ${followerId} not found`);
    }

    // Check if the followee's account is private
    if (followee.accountType !== ProfileAccess.Private) {
      throw new Errors.BadRequestError(`User ${followee.username}'s account is not private`);
    }

    // Fetch the follow document for the followee
    const followeeFollowDoc = await this.followDAO.findOne({ userId: followeeId });

    if (!followeeFollowDoc) {
      throw new Errors.ResourceNotFoundError(`Follow document for user ${followee.username} not found`);
    }

    // Check if the follower has requested to follow the followee
    if (!followeeFollowDoc.requests.includes(followerId)) {
      throw new Errors.BadRequestError(`User ${follower.username} has not requested to follow ${followee.username}`);
    }

    // Remove the followerId from the followee's requests array
    await this.followDAO.updateOne(
        { userId: followeeId },
        { $pull: { requests: followerId } },
        { new: true},
    );
  }
    
}

export default UserProfileService;