import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { IUserProfile, UserProfileModel } from "../models/userProfile";
import { IFollow, FollowModel } from "../models/followModel";
import FollowDAO from "../dataAccess/FollowDAO";
import * as Errors from "../utils/errors";
import { Types, HydratedDocument } from "mongoose";
import { IUser } from "../models/userModel";
import logger from "../common/logger";

class UserProfileService {
    private userProfileDAO: UserProfileDAO;
    private followDAO: FollowDAO;

    constructor() {
      this.userProfileDAO = new UserProfileDAO(UserProfileModel);
      this.followDAO = new FollowDAO(FollowModel);
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
      const user = await this.followDAO.findOneAndPopulate({ userId }, "followers");
      const followers = user.followers;

      console.log("Followers 1: ", followers);

      if (!user) {
        throw new Errors.ResourceNotFoundError("User not found");
      }
      return followers;
    }

    public async getFollowing(userId: Types.ObjectId) {
      const following = await this.followDAO.getFollowing(userId);
     
      // if (!user) {
      //   throw new Errors.ResourceNotFoundError("User not found");
      // }
      
      console.log("Following 1: ", following[0]);
    
      return following;
    }
    
}

export default UserProfileService;