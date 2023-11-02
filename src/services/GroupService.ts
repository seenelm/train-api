import GroupDAO from "../dataAccess/GroupDAO";
import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import UserModel from "../models/userModel";
import { Types } from "mongoose";


class GroupService {
    private groupDAO: GroupDAO;
    private userDAO: UserDAO;

    constructor() {
        this.groupDAO = new GroupDAO();
        this.userDAO = new UserDAO(UserModel);
    }

    public async addGroup(name: string, userId: Types.ObjectId | string) {
        const user = await this.userDAO.findById(userId);
        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found");
        }

        const ownerId = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
       
        const group = await this.groupDAO.create({ name });
        group.owner.push(ownerId);
        user.groups.push(group._id);
    
        await user.save();
        await group.save();
    
        const newGroup = {
            id: group._id,
            name: group.name,
        };

        return { newGroup: newGroup };
    }
}

export default new GroupService();