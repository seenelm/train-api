import UserDAO from "../dataAccess/UserDAO";
import * as Errors from "../utils/errors";
import JWTUtil from "../utils/JWTUtil";
import BcryptUtil from "../utils/BcryptUtil";
import { IUser } from "../models/userModel";
import UserProfileDAO from "../dataAccess/UserProfileDAO";
import { IUserProfile } from "../models/userProfile";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { IUserGroups } from "../models/userGroups";
import FollowDAO from "../dataAccess/FollowDAO";
import CustomLogger from "../common/logger";
import { Types } from "mongoose";

export interface TokenPayload {
    name: string;
    userId: Types.ObjectId;
}

class UserService {
    private userDAO: UserDAO;
    private userProfileDAO: UserProfileDAO;
    private userGroupsDAO: UserGroupsDAO;
    private followDAO: FollowDAO;
    private logger: CustomLogger;

    constructor(
        userDAO: UserDAO,
        userProfileDAO: UserProfileDAO,
        userGroupsDAO: UserGroupsDAO,
        followDAO: FollowDAO,
    ) {
        this.userDAO = userDAO;
        this.userProfileDAO = userProfileDAO;
        this.userGroupsDAO = userGroupsDAO;
        this.followDAO = followDAO;
        this.logger = new CustomLogger(this.constructor.name);
    }

    public async registerUser(
        username: string,
        password: string,
        name: string,
    ) {
        // const session = await db.startSession();
        // session.startTransaction();

        // try {
        const existingUser = await this.userDAO.findOne({ username });
        if (existingUser) {
            throw new Errors.ConflictError("username already taken");
        }
        const hash = await BcryptUtil.hashPassword(password).catch((error) => {
            this.logger.logError(
                `Error hashing password for user ${username}`,
                error,
            );
        });

        const newUser = await this.userDAO
            .create({ username, password: hash, isActive: true })
            .catch((error) => {
                throw error;
            });

        this.logger.logInfo(`User ${username} was added to database: `, {
            newUser,
        });

        const newUserProfile = await this.userProfileDAO.create({
            userId: newUser._id,
            name,
            username,
        });
        this.logger.logInfo(`User profile was created: `, {
            username,
            newUserProfile,
        });

        const userGroups = await this.userGroupsDAO.create({
            userId: newUser._id,
        });
        this.logger.logInfo(`User Group document was created: `, {
            username,
            userGroups,
        });

        const follow = await this.followDAO.create({ userId: newUser._id });
        this.logger.logInfo("User follow document was created", {
            username,
            follow,
        });

        const payload: TokenPayload = {
            name: newUserProfile.name,
            userId: newUser._id,
        };

        const token = await JWTUtil.sign(
            payload,
            process.env.SECRET_CODE,
        ).catch((error) => {
            this.logger.logError(
                `Error signing JWT for user ${username}`,
                error,
            );
        });

        return { userId: newUser._id, token, username };

        // } catch (error) {
        //   await session.abortTransaction();
        //   throw error;
        // } finally {
        //   session.endSession();
        // }
    }

    public async loginUser(username: string, password: string) {
        const user = await this.userDAO.findOne({ username });
        let errors = {};

        if (!user) {
            errors = { username: "Incorrect Username or Password" };
            throw new Errors.AuthError(errors, 400);
        }

        const validPassword = await BcryptUtil.comparePassword(
            password,
            user.password,
        ).catch((error) => {
            this.logger.logError(
                `Error validating password for user ${username}`,
                error,
            );
        });

        if (!validPassword) {
            errors = { password: "Incorrect Username or Password" };
            throw new Errors.AuthError(errors, 400);
        }

        const userProfile = await this.userProfileDAO.findOne({
            userId: user._id,
        });

        const payload: TokenPayload = {
            name: userProfile.name,
            userId: user._id,
        };

        const token = await JWTUtil.sign(
            payload,
            process.env.SECRET_CODE,
        ).catch((error) => {
            this.logger.logError(
                `Error signing JWT for user ${username}`,
                error,
            );
        });

        this.logger.logInfo("User logged in", { username, userId: user._id });

        return {
            userId: user._id,
            token: token,
            username: username,
        };
    }

    public async findUserById(userId: Types.ObjectId): Promise<IUser | null> {
        const user = await this.userDAO.findUserById(
            userId,
            "username isActive",
        );

        if (!user) {
            throw new Errors.ResourceNotFoundError("User not found", {
                userId,
            });
        }

        this.logger.logInfo("Find User By Id", { user });

        return user;
    }

    public async deleteUserAccount(userId: Types.ObjectId): Promise<void> {
        await this.userDAO.deleteUserAccount(userId);
    }
}

export default UserService;
