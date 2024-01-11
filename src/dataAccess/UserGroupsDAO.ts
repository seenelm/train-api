import BaseDAO from "./BaseDAO";
import { IUserGroups } from "../models/userGroups";
import { Model, FilterQuery } from "mongoose";

class UserGroupsDAO extends BaseDAO<IUserGroups> {
    private userGroups: Model<IUserGroups>;

    constructor(userGroups: Model<IUserGroups>) {
        super(userGroups);
        this.userGroups = userGroups;
    }

    public async findOneAndPopulate(
        query: FilterQuery<IUserGroups>,
        path: string,
    ): Promise<IUserGroups | null> {
        return await this.userGroups
            .findOne(query)
            .populate({ path: path })
            .exec();
    }
}

export default UserGroupsDAO;
