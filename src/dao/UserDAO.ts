import { IUser } from "../model/userModel";
import BaseDAO from "./BaseDAO";
import { Model, Types } from "mongoose";
import { GroupModel } from "../model/groupModel";
import { IUserProfile, UserProfileModel } from "../model/userProfile";
import { IUserGroups, UserGroupsModel } from "../model/userGroups";
import { ResourceNotFoundError } from "../utils/errors";
import CustomLogger from "../common/logger";

class UserDAO extends BaseDAO<IUser> {
    private userModel: Model<IUser>;
    private logger: CustomLogger;

    constructor(userModel: Model<IUser>) {
        super(userModel);
        this.userModel = userModel;
        this.logger = new CustomLogger(this.constructor.name);
    }

    public async findUserById(
        userId: Types.ObjectId,
        field: string,
    ): Promise<IUser | null> {
        return await this.userModel.findById(userId).select(field).exec();
    }

    public async fetchUserData(
        userId: Types.ObjectId,
    ): Promise<(IUser & IUserProfile & IUserGroups)[] | null> {
        const userData = await this.userModel.aggregate([
            {
                $match: {
                    _id: userId,
                },
            },
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userProfile",
                },
            },
            {
                $lookup: {
                    from: "usergroups",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userGroups",
                },
            },
            {
                $project: {
                    username: 1,
                    userProfile: 1,
                    userGroups: 1,
                },
            },
        ]);

        return userData;
    }

    public async deleteUserAccount(userId: Types.ObjectId): Promise<void> {
        const user = await this.userModel.findByIdAndDelete(userId).exec();

        if (!user) {
            throw new ResourceNotFoundError("User not found");
        }
        this.logger.logInfo(`User "${user.username}" was deleted`, {
            userId,
            username: user.username,
        });

        await UserProfileModel.deleteOne({ userId }).exec();
        this.logger.logInfo(`User "${user.username}" Profile was deleted`, {
            userId,
            username: user.username,
        });

        // Get the document first
        const userGroupsDoc = await UserGroupsModel.findOne({ userId }).exec();

        // Store the groups before deletion if they exist
        const groups = userGroupsDoc?.groups || [];

        // Then delete the document
        await UserGroupsModel.deleteOne({ userId }).exec();

        this.logger.logInfo(
            `User Groups for User ${user.username} was deleted`,
        );

        if (groups.length > 0) {
            await GroupModel.deleteMany({ _id: { $in: groups } }).exec();
        }
    }
}

export default UserDAO;
