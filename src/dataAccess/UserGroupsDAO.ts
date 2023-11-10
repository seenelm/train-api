import BaseDAO from "./BaseDAO";
import { IUserGroups } from "../models/userGroups";
import { Model, FilterQuery } from "mongoose";
import { IUser } from "../models/userModel";

class UserGroupsDAO extends BaseDAO<IUserGroups> {

    private userGroups: Model<IUserGroups>;
  
    constructor(userGroups: Model<IUserGroups>) {
        super(userGroups);
        this.userGroups = userGroups;
    }

    public async findOneUser(query: FilterQuery<IUserGroups>, path: string): Promise<IUserGroups | null> {
        return await this.userGroups.findOne(query)
        .populate<{user: IUser}>({path: path})
        .exec();
    }
}

export default UserGroupsDAO;