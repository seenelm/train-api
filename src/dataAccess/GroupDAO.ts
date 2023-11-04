import { IGroup, GroupModel } from "../models/groupModel";
import BaseDAO from "./BaseDAO";
import { Model } from "mongoose";

class GroupDAO extends BaseDAO<IGroup> {

    private groupModel: Model<IGroup>;
  
    constructor(groupModel: Model<IGroup>) {
        super(groupModel);
        this.groupModel = groupModel;
    }
}

export default GroupDAO;