import GroupDAO from "../dataAccess/GroupDAO";
import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors.js";


class GroupService {
    private groupDAO: GroupDAO;
    private userDAO: UserDAO;

    constructor() {
        this.groupDAO = new GroupDAO();
        this.userDAO = new UserDAO();
    }

    public async addGroup(name: string, userId: any) {
        
        const user = await this.userDAO.findById(userId);
        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found");
        }
       
        const group = await this.groupDAO.create({ name });
        group.owner = userId;
        user.groups.push(group._id);
    
        await user.save();
    
        const newGroup = {
            id: group._id,
            name: group.name,
        };

        return { newGroup: newGroup };
    }
}

export default new GroupService();