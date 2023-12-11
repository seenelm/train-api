import GroupDAO from "../dataAccess/GroupDAO";
import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import { UserModel, IUser } from "../models/userModel";
import { Types } from "mongoose";
import { GroupModel, Group } from "../models/groupModel";


class GroupService {
    private groupDAO: GroupDAO;
    private userDAO: UserDAO;
    private groupInstance: Group;

    constructor() {
        this.groupDAO = new GroupDAO(GroupModel);
        this.userDAO = new UserDAO(UserModel);
        this.groupInstance = new Group(null);
    }

    public async addGroup(name: string, userId: Types.ObjectId | string) {
        const user = await this.userDAO.findById(userId);
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

        return { newGroup: newGroup };
    }

    public async updateGroupBio(userId: Types.ObjectId | string, groupId: Types.ObjectId | string, groupBio: string | null): Promise<void> {
        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);

        if (!groupBio) {
          throw new Errors.BadRequestError("Group Bio is Undefined");
        }

        const group = await this.groupDAO.findById(groupId);
        if (!group) {
          throw new Errors.ResourceNotFoundError("User does not exist");
        }

        const isOwner = group.owners.map((owner: IUser) => {
            return owner._id === ownerId
        });
      
        if (!isOwner) {
            throw new Errors.ForbiddenError("User doesn't have permission to update group bio");
        }
    
        this.groupInstance.group = group;
        await this.groupInstance.setBio(groupBio);
    }

    public async updateGroupName(userId: Types.ObjectId | string, groupId: Types.ObjectId | string, groupName: string | null): Promise<void> {
        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);

        if (!groupName || groupName.trim() === "") {
            throw new Errors.BadRequestError("Invalid Group Name");
        }

        const group = await this.groupDAO.findById(groupId);
        if (!group) {
          throw new Errors.ResourceNotFoundError("User does not exist");
        }

        const isOwner = group.owners.map((owner: IUser) => {
            return owner._id === ownerId
        });
      
        if (!isOwner) {
            throw new Errors.ForbiddenError("User doesn't have permission to update group bio");
        }
    
        this.groupInstance.group = group;
        await this.groupInstance.setName(groupName);
    }
}

export default GroupService;