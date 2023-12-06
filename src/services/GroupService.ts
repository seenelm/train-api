import GroupDAO from "../dataAccess/GroupDAO";
import * as Errors from "../utils/errors";
import { IUser } from "../models/userModel";
import { Types, startSession } from "mongoose";
import { GroupModel, IGroup } from "../models/groupModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import { db } from "../app";
import mongoose from "mongoose";
import { logger, errorLogger } from "../common/logger";
import { ProfileAccess } from "../common/constants";

export class GroupService {
  private groupDAO: GroupDAO;
  private userGroupsDAO: UserGroupsDAO;

  constructor(groupDAO: GroupDAO, userGroupsDAO: UserGroupsDAO) {
    this.groupDAO = groupDAO;
    this.userGroupsDAO = userGroupsDAO;
  }

  public async addGroup(name: string, userId: Types.ObjectId): Promise<IGroup> {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    // try {

    const ownerId = userId;

    const group = await this.groupDAO.create({ name, owners: [ownerId] });

    const user = await this.userGroupsDAO.findOneAndUpdate(
      { userId },
      { $push: { groups: group._id } },
      { new: true }
    );

    if (!user) {
      throw new Errors.ResourceNotFoundError("User not found");
    }
    // user.groups.push(group._id);
    // await user.save();

    logger.info(`Owner "${ownerId}" added Group: `, group);

    return group;
    // } catch (error) {
    //   console.error(error);
    //   errorLogger.error(error);
    //   await session.abortTransaction();
    //   throw error;
    // } finally {
    //   session.endSession();
    // }
  }

  public async fetchGroup(groupId: Types.ObjectId): Promise<IGroup | null> {
    const group = await this.groupDAO.findById(groupId);

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group not found.");
    }

    logger.info(`Fetch Group "${groupId}": `, group);

    return group;
  }

  public async updateGroupBio(
    userId: Types.ObjectId,
    groupId: Types.ObjectId,
    groupBio: string | null
  ): Promise<void> {
    const ownerId = userId;

    if (!groupBio) {
      errorLogger.error("Group Bio is Undefined");
      throw new Errors.BadRequestError("Group Bio is Undefined");
    }

    const group = await this.groupDAO.findOne({ _id: groupId });

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    const isOwner = group.owners.some((owner: Types.ObjectId) =>
      owner._id.equals(ownerId)
    );

    if (!isOwner) {
      logger.error("User doesn't have permission to update group bio");
      throw new Errors.ForbiddenError(
        "User doesn't have permission to update group bio"
      );
    }

    const updatedGroup = await this.groupDAO.findOneAndUpdate(
      { _id: groupId },
      { bio: groupBio },
      { new: true }
    );

    if (!updatedGroup) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    logger.info(`Owner "${ownerId}" updated Group Bio: `, updatedGroup);
  }

  public async updateGroupName(
    userId: Types.ObjectId,
    groupId: Types.ObjectId,
    groupName: string | null
  ): Promise<void> {
    const ownerId = userId;

    if (!groupName || groupName.trim() === "") {
      throw new Errors.BadRequestError("Invalid Group Name");
    }

    const group = await this.groupDAO.findOne({ _id: groupId });

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    const isOwner = group.owners.some((owner: Types.ObjectId) =>
      owner._id.equals(ownerId)
    );

    if (!isOwner) {
      logger.error("User doesn't have permission to update group name");
      throw new Errors.ForbiddenError(
        "User doesn't have permission to update group name"
      );
    }

    const updatedGroup = await this.groupDAO.findOneAndUpdate(
      { _id: groupId },
      { name: groupName },
      { new: true }
    );

    logger.info(`Owner "${ownerId}" updated Group Name: `, updatedGroup);
  }

  public async joinGroup(
    userId: Types.ObjectId,
    groupId: Types.ObjectId
  ): Promise<void> {
    if (!userId || !(userId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid user id");
    }

    if (!groupId || !(groupId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid group id");
    }

    const group = await this.groupDAO.findById(groupId);

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    if (group.accountType !== ProfileAccess.Public) {
      throw new Errors.BadRequestError(
        `Group ${group.name} account is not public`
      );
    }

    const isMember = group.users.some((user: Types.ObjectId) =>
      user._id.equals(userId)
    );

    if (isMember) {
      throw new Errors.ConflictError("User is already member of group", null);
    }

    const updatedGroup = await this.groupDAO.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { users: userId } },
      { new: true }
    );

    logger.info(`User "${userId}" joined Group: `, updatedGroup);
  }

  public async requestToJoinGroup(
    userId: Types.ObjectId,
    groupId: Types.ObjectId
  ): Promise<void> {
    if (!userId || !(userId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid user id");
    }

    if (!groupId || !(groupId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid group id");
    }

    const group = await this.groupDAO.findById(groupId);

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    if (group.accountType !== ProfileAccess.Private) {
      throw new Errors.BadRequestError(
        `Group ${group.name} account is not private`
      );
    }

    const isMember = group.users.some((user: Types.ObjectId) =>
      user._id.equals(userId)
    );

    if (isMember) {
      throw new Errors.ConflictError("User is already member of group", null);
    }

    const existingRequest = group.requests.some((request: Types.ObjectId) =>
      request._id.equals(userId)
    );

    if (existingRequest) {
      throw new Errors.ConflictError("Request already sent", null);
    }

    const updatedGroup = await this.groupDAO.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { requests: userId } },
      { new: true }
    );

    logger.info(`User "${userId}" requested to join Group: `, updatedGroup);
  }

  public async acceptGroupRequest(
    userId: Types.ObjectId,
    ownerId: Types.ObjectId,
    groupId: Types.ObjectId
  ): Promise<void> {
    if (!userId || !(userId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid user id");
    }

    if (!ownerId || !(ownerId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid owner id");
    }

    if (!groupId || !(groupId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid group id");
    }

    const group = await this.groupDAO.findById(groupId);

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    if (group.accountType !== ProfileAccess.Private) {
      throw new Errors.BadRequestError(
        `Group ${group.name} account is not private`
      );
    }

    const isOwner = group.owners.some((owner: Types.ObjectId) =>
      owner._id.equals(ownerId)
    );

    if (!isOwner) {
      throw new Errors.ForbiddenError(
        "User doesn't have permission to accept group request"
      );
    }

    if (!group.requests.includes(userId)) {
      throw new Errors.BadRequestError("User did not request to join group");
    }

    const updatedGroup = await this.groupDAO.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { users: userId }, $pull: { requests: userId } },
      { new: true }
    );

    logger.info(`Owner "${ownerId}" accepted Group Request: `, updatedGroup);
  }

  public async rejectGroupRequest(
    userId: Types.ObjectId,
    ownerId: Types.ObjectId,
    groupId: Types.ObjectId
  ): Promise<void> {
    if (!userId || !(userId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid user id");
    }

    if (!ownerId || !(ownerId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid owner id");
    }

    if (!groupId || !(groupId instanceof Types.ObjectId)) {
      throw new Errors.BadRequestError("Invalid group id");
    }

    const group = await this.groupDAO.findById(groupId);

    if (!group) {
      throw new Errors.ResourceNotFoundError("Group does not exist");
    }

    if (group.accountType !== ProfileAccess.Private) {
      throw new Errors.BadRequestError(
        `Group ${group.name} account is not private`
      );
    }

    const isOwner = group.owners.some((owner: Types.ObjectId) =>
      owner._id.equals(ownerId)
    );

    if (!isOwner) {
      throw new Errors.ForbiddenError(
        "User doesn't have permission to reject group request"
      );
    }

    if (!group.requests.includes(userId)) {
      throw new Errors.BadRequestError("User did not request to join group");
    }

    const updatedGroup = await this.groupDAO.findOneAndUpdate(
      { _id: groupId },
      { $pull: { requests: userId } },
      { new: true }
    );

    logger.info(`Owner "${ownerId}" rejected Group Request: `, updatedGroup);
  }
}

// export default GroupService;
