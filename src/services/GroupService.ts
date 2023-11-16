import GroupDAO from "../dataAccess/GroupDAO";
import * as Errors from "../utils/errors";
import { IUser } from "../models/userModel";
import { Types, startSession } from "mongoose";
import { GroupModel, IGroup } from "../models/groupModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";


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
        console.log("User: ", user);
        
        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found");
        }

        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
       
        const group = await this.groupDAO.create({ name });
        group.owners.push(ownerId);
        user.groups.push(group._id);
    
        await user.save();
        await group.save();
    
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

    public async updateGroupBio(userId: Types.ObjectId | string, groupId: Types.ObjectId | string, groupBio: string | null): Promise<void> {
        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);

        if (!groupBio) {
          throw new Errors.BadRequestError("Group Bio is Undefined");
        }

        const group = await this.groupDAO.findOneAndUpdate(
            { _id: groupId},
            { bio: groupBio },
            { new: true }
        );

        if (!group) {
          throw new Errors.ResourceNotFoundError("Group does not exist");
        }

        const isOwner = group.owners.map((owner: IUser) => {
            return owner._id === ownerId
        });
      
        if (!isOwner) {
            throw new Errors.ForbiddenError("User doesn't have permission to update group bio");
        }
    }

    public async updateGroupName(userId: Types.ObjectId | string, groupId: Types.ObjectId | string, groupName: string | null): Promise<void> {
        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);

        if (!groupName || groupName.trim() === "") {
            throw new Errors.BadRequestError("Invalid Group Name");
        }

        const group = await this.groupDAO.findOneAndUpdate(
            { _id: groupId},
            { name: groupName },
            { new: true }
        );

        if (!group) {
          throw new Errors.ResourceNotFoundError("Group does not exist");
        }

        // const isOwner = group.owners.map((owner: IUser) => {
        //     return owner._id === ownerId
        // });

        const isOwner = group.owners.some((owner: IUser) => {
            return owner._id === ownerId;
        })
      
        if (!isOwner) {
            throw new Errors.ForbiddenError("User doesn't have permission to update group name");
        }
    }

    // return group data
    // public async fetchGroup(groupId: Types.ObjectId): Promise<IGroup[]> | null {}
}

export default GroupService;