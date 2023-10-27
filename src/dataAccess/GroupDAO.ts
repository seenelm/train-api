import GroupModel from "../models/groupModel";
import Group from "../models/interfaces/Group";
import BaseDAO from "./BaseDAO";

class GroupDAO extends BaseDAO<Group> {

    constructor() {
        super(GroupModel);
    }
}

export default GroupDAO;