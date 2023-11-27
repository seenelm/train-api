import GroupDAO from "../dataAccess/GroupDAO";
import * as Errors from "../utils/errors";
import { IUser } from "../models/userModel";
import { Types, startSession } from "mongoose";
import { GroupModel, IGroup } from "../models/groupModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import logger from "../common/logger";

class GroupService {
    private groupDAO: GroupDAO;
    private userGroupsDAO: UserGroupsDAO;

    constructor() {
        this.groupDAO = new GroupDAO(GroupModel);
        this.userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
    }

    public async addGroup(name: string, userId: Types.ObjectId | string) {
        // const session = await startSession();

        // try {
        const user = await this.userGroupsDAO.findOne({ userId });
        
        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found");
        }

        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
       
        const group = await this.groupDAO.create({ name });
        group.owners.push(ownerId);
        user.groups.push(group._id);
    
        await user.save();
        await group.save();

        logger.info(`Owner "${ownerId}" added Group: `, group);
    
        const newGroup = {
            id: group._id,
            name: group.name,
        };

        return { newGroup };
        // catch (error) {
        //     await session.abortTransaction();
        //     throw error;
        // } finally {
        //     session.endSession();
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

    public async updateGroupBio(userId: Types.ObjectId, groupId: Types.ObjectId, groupBio: string | null): Promise<void> {
        const ownerId = userId;

        if (!groupBio) {
            logger.error("Group Bio is Undefined");
            throw new Errors.BadRequestError("Group Bio is Undefined");
        }

        const group = await this.groupDAO.findOne({ _id: groupId });

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist");
        }

        const isOwner = group.owners.some((owner: Types.ObjectId ) => owner._id.equals(ownerId));

        if (!isOwner) {
            logger.error("User doesn't have permission to update group bio");
            throw new Errors.ForbiddenError("User doesn't have permission to update group bio");
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

    public async updateGroupName(userId: Types.ObjectId, groupId: Types.ObjectId, groupName: string | null): Promise<void> {
        const ownerId = userId;

        if (!groupName || groupName.trim() === "") {
            throw new Errors.BadRequestError("Invalid Group Name");
        }

        const group = await this.groupDAO.findOne({ _id: groupId });

        if (!group) {
            throw new Errors.ResourceNotFoundError("Group does not exist");
        }

        const isOwner = group.owners.some((owner: Types.ObjectId ) => owner._id.equals(ownerId));

        if (!isOwner) {
            logger.error("User doesn't have permission to update group name");
            throw new Errors.ForbiddenError("User doesn't have permission to update group name");
        }

        const updatedGroup = await this.groupDAO.findOneAndUpdate(
            { _id: groupId},
            { name: groupName },
            { new: true }
        );

        if (!updatedGroup) {
            throw new Errors.ResourceNotFoundError("Group does not exist");
        }

        logger.info(`Owner "${ownerId}" updated Group Name: `, updatedGroup);
    }
}

export default GroupService;