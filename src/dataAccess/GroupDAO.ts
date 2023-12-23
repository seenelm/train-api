import { IGroup } from "../models/groupModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";

class GroupDAO extends BaseDAO<IGroup> {

    private groupModel: Model<IGroup>;
  
    constructor(groupModel: Model<IGroup>) {
        super(groupModel);
        this.groupModel = groupModel;
    }

    public async findGroupById(groupId: Types.ObjectId, field: string): Promise<IGroup | null> {
        return await this.groupModel.findById(groupId)
        .select(field)
        .exec();
    }
}

export default GroupDAO;