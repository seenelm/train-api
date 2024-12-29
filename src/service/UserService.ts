import UserDAO from "../dao/UserDAO";
import * as Errors from "../utils/errors";
import JWTUtil from "../utils/JWTUtil";
import BcryptUtil from "../utils/BcryptUtil";
import { IUser } from "../model/userModel";
import UserProfileDAO from "../dao/UserProfileDAO";
import { IUserProfile } from "../model/userProfile";
import UserGroupsDAO from "../dao/UserGroupsDAO";
import { IUserGroups } from "../model/userGroups";
import FollowDAO from "../dao/FollowDAO";
import CustomLogger from "../common/logger";
import { Types } from "mongoose";

import { UserRegisterRequest, UserLoginRequest } from "../dto/userRequest";
import { UserRegisterResponse, UserLoginResponse } from "../dto/userResponse";

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
        userRegisterRequest: UserRegisterRequest,
    ): Promise<UserRegisterResponse> {
        const { username, password, name } = userRegisterRequest;

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

        const newUserProfile = await this.userProfileDAO.create({
            userId: newUser._id,
            name,
            username,
        });

        const userGroups = await this.userGroupsDAO.create({
            userId: newUser._id,
        });

        const follow = await this.followDAO.create({ userId: newUser._id });

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

        const userRegisterResponse: UserRegisterResponse = {
            userId: newUser._id,
            token,
            username,
            name,
        };

        return userRegisterResponse;
    }

    public async loginUser(
        userLoginRequest: UserLoginRequest,
    ): Promise<UserLoginResponse> {
        const { username, password } = userLoginRequest;
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

        const userLoginResponse: UserLoginResponse = {
            userId: user._id,
            token,
            username,
            name: userProfile.name,
        };

        return userLoginResponse;
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
