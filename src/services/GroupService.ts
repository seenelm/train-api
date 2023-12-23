import GroupDAO from "../dataAccess/GroupDAO";
import * as Errors from "../utils/errors";
import { Types, startSession } from "mongoose";
import { IGroup } from "../models/groupModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import CustomLogger from "../common/logger";
import { ProfileAccess } from "../common/constants";

class GroupService {
    private groupDAO: GroupDAO;
    private userGroupsDAO: UserGroupsDAO;
    private logger: CustomLogger;

    constructor(groupDAO: GroupDAO, userGroupsDAO: UserGroupsDAO) {
        this.groupDAO = groupDAO;
        this.userGroupsDAO = userGroupsDAO;
        this.logger = new CustomLogger(this.constructor.name);
    }

    public async addGroup(
        groupName: string,
        userId: Types.ObjectId,
    ): Promise<IGroup> {
        // const session = await mongoose.startSession();
        // session.startTransaction();

        // try {

        const ownerId = userId;

        const group = await this.groupDAO.create({
            groupName: groupName,
            owners: [ownerId],
        });

        const user = await this.userGroupsDAO.findOneAndUpdate(
            { userId },
            { $push: { groups: group._id } },
            { new: true },
        );

        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found", {
                userId,
            });
        }
        // user.groups.push(group._id);
        // await user.save();

        this.logger.logInfo("Owner added a Group", { ownerId, group, user });

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

    public async fetchGroup(groupId: Types.ObjectId): Promise<IGroup> {
        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group not found", {
                groupId,
            });
        }

        this.logger.logInfo("Fetched Group", { groupId, group });

        return group;
    }

    public async updateGroupProfile(
        ownerId: Types.ObjectId,
        groupId: Types.ObjectId,
        groupBio: string,
        groupName: string,
        accountType: number,
    ): Promise<void> {
        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        const isOwner = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(ownerId),
        );

        if (!isOwner) {
            throw new Errors.ForbiddenError(
                "User doesn't have permission to update group profile",
                { userId: ownerId, owners: group.owners },
            );
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { bio: groupBio, groupName, accountType },
            { new: true },
        );

        if (!updatedGroup) {
            throw new Errors.InternalServerError(
                "Failed to update group profile",
                {
                    ownerId,
                    groupId,
                    groupBio,
                    groupName,
                    accountType,
                },
            );
        }

        this.logger.logInfo("Owner updated Group Profile", {
            ownerId,
            updatedGroup,
        });
    }

    public async joinGroup(
        userId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        if (group.accountType !== ProfileAccess.Public) {
            throw new Errors.BadRequestError("Group account is not public", {
                accountType: group.accountType,
                groupName: group.groupName,
            });
        }

        const isMember = group.users.some((user: Types.ObjectId) =>
            user._id.equals(userId),
        );

        if (isMember) {
            throw new Errors.ConflictError("User is already member of group", {
                userId,
                groupMembers: group.users,
            });
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $addToSet: { users: userId } },
            { new: true },
        );

        this.logger.logInfo("User joined Group", { userId, updatedGroup });
    }

    public async requestToJoinGroup(
        userId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        if (group.accountType !== ProfileAccess.Private) {
            throw new Errors.BadRequestError("Group account is not private", {
                accountType: group.accountType,
                groupName: group.groupName,
            });
        }

        const isMember = group.users.some((user: Types.ObjectId) =>
            user._id.equals(userId),
        );

        if (isMember) {
            throw new Errors.ConflictError("User is already member of group", {
                userId,
                groupMembers: group.users,
            });
        }

        const existingRequest = group.requests.some((request: Types.ObjectId) =>
            request._id.equals(userId),
        );

        if (existingRequest) {
            throw new Errors.ConflictError("User already sent a request", {
                userId,
                groupRequests: group.requests,
            });
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $addToSet: { requests: userId } },
            { new: true },
        );

        this.logger.logInfo("User requested to join Group", {
            userId,
            updatedGroup,
        });
    }

    public async acceptGroupRequest(
        userId: Types.ObjectId,
        ownerId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!ownerId || !(ownerId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid owner id", { ownerId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        if (group.accountType !== ProfileAccess.Private) {
            throw new Errors.BadRequestError("Group account is not private", {
                accountType: group.accountType,
                groupName: group.groupName,
            });
        }

        const isOwner = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(ownerId),
        );

        if (!isOwner) {
            throw new Errors.ForbiddenError(
                "User doesn't have permission to accept group request",
                { userId, owners: group.owners },
            );
        }

        if (!group.requests.includes(userId)) {
            throw new Errors.BadRequestError(
                "User did not request to join group",
                {
                    userId,
                    groupRequests: group.requests,
                },
            );
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $addToSet: { users: userId }, $pull: { requests: userId } },
            { new: true },
        );

        this.logger.logInfo("Owner accepted Group Request", {
            ownerId,
            updatedGroup,
        });
    }

    public async rejectGroupRequest(
        userId: Types.ObjectId,
        ownerId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!ownerId || !(ownerId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid owner id", { ownerId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        if (group.accountType !== ProfileAccess.Private) {
            throw new Errors.BadRequestError("Group account is not private", {
                accountType: group.accountType,
                groupName: group.groupName,
            });
        }

        const isOwner = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(ownerId),
        );

        if (!isOwner) {
            throw new Errors.ForbiddenError(
                "User doesn't have permission to reject group request",
                { userId, owners: group.owners },
            );
        }

        if (!group.requests.includes(userId)) {
            throw new Errors.BadRequestError(
                "User did not request to join group",
                {
                    userId,
                    groupRequests: group.requests,
                },
            );
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $pull: { requests: userId } },
            { new: true },
        );

        this.logger.logInfo("Owner rejected Group Request", {
            ownerId,
            updatedGroup,
        });
    }

    public async leaveGroup(
        userId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        const isMember = group.users.some((user: Types.ObjectId) =>
            user._id.equals(userId),
        );

        if (!isMember) {
            throw new Errors.BadRequestError(
                "User is not a member of the group",
                {
                    userId,
                    groupMembers: group.users,
                },
            );
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $pull: { users: userId } },
            { new: true },
        );

        this.logger.logInfo("User left Group", { userId, updatedGroup });
    }

    public async removeUserFromGroup(
        userId: Types.ObjectId,
        ownerId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!ownerId || !(ownerId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid owner id", { ownerId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        const isOwner = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(ownerId),
        );

        if (!isOwner) {
            throw new Errors.ForbiddenError(
                "User doesn't have permission to remove user from group",
                { userId, owners: group.owners },
            );
        }

        const isMember = group.users.some((user: Types.ObjectId) =>
            user._id.equals(userId),
        );

        if (!isMember) {
            throw new Errors.BadRequestError(
                "User is not a member of the group",
                {
                    userId,
                    groupMembers: group.users,
                },
            );
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $pull: { users: userId } },
            { new: true },
        );

        this.logger.logInfo("Owner removed User from Group", {
            ownerId,
            userId,
            updatedGroup,
        });
    }

    public async deleteGroup(
        userId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<void> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        const isOwner = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(userId),
        );

        if (!isOwner) {
            throw new Errors.ForbiddenError(
                "User doesn't have permission to delete group",
                { userId, owners: group.owners },
            );
        }

        const updatedGroup = await this.groupDAO.findByIdAndDelete(groupId);

        const userGroups = await this.userGroupsDAO.updateMany(
            { groups: groupId },
            { $pull: { groups: groupId } },
            { isDeleted: true },
        );

        this.logger.logInfo("Owner deleted Group", {
            userId,
            updatedGroup,
            userGroups,
        });
    }

    public async addOwner(
        userId: Types.ObjectId,
        ownerId: Types.ObjectId,
        groupId: Types.ObjectId,
    ): Promise<IGroup> {
        if (!userId || !(userId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid user id", { userId });
        }

        if (!ownerId || !(ownerId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid owner id", { ownerId });
        }

        if (!groupId || !(groupId instanceof Types.ObjectId)) {
            throw new Errors.BadRequestError("Invalid group id", { groupId });
        }

        const group = await this.groupDAO.findById(groupId);

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist", {
                groupId,
            });
        }

        const isOwner = group.owners.some((owner: Types.ObjectId) =>
            owner._id.equals(ownerId),
        );

        if (!isOwner) {
            throw new Errors.ForbiddenError(
                "User doesn't have permission to add owner",
                { userId, owners: group.owners },
            );
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId },
            { $addToSet: { owners: userId } },
            { new: true },
        );

        this.logger.logInfo("Owner added Owner to Group", {
            userId,
            ownerId,
            updatedGroup,
        });

        return updatedGroup;
    }
}

export default GroupService;
