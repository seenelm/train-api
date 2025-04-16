import UserDAO from "../dao/UserDAO";
import * as Errors from "../utils/errors";
import JWTUtil from "../utils/JWTUtil";
import BcryptUtil from "../utils/BcryptUtil";
import { IUser } from "../model/userModel";
import UserProfileDAO from "../dao/UserProfileDAO";
import UserGroupsDAO from "../dao/UserGroupsDAO";
import FollowDAO from "../dao/FollowDAO";
import CustomLogger from "../common/logger";
import { Types } from "mongoose";

import { UserLoginRequest } from "../dto/userRequest";
import { UserRegisterResponse, UserLoginResponse } from "../dto/userResponse";
import UserRegisterRequest from "../dto/UserRegisterRequest";
import mongoose from "mongoose";
import { APIError } from "../common/errors/APIError";

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
        const username = userRegisterRequest.getUsername();
        const password = userRegisterRequest.getPassword();
        const name = userRegisterRequest.getName();
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const existingUser = await this.userDAO.findOne({ username });
            if (existingUser) {
                throw APIError.Conflict("username already taken");
            }

            // Hash password
            const hash = await BcryptUtil.hashPassword(password);

            const newUser = await this.userDAO.create({
                username,
                password: hash,
                isActive: true,
            });

            await Promise.all([
                this.userProfileDAO.create(
                    {
                        userId: newUser._id,
                        name,
                        username,
                    },
                    { session },
                ),
                this.userGroupsDAO.create(
                    {
                        userId: newUser._id,
                    },
                    { session },
                ),
                await this.userGroupsDAO.create(
                    {
                        userId: newUser._id,
                    },
                    { session },
                ),
            ]);

            // const newUserProfile = await this.userProfileDAO.create({
            //     userId: newUser._id,
            //     name,
            //     username,
            // });

            // const userGroups = await this.userGroupsDAO.create({
            //     userId: newUser._id,
            // });

            // const follow = await this.followDAO.create({ userId: newUser._id });

            const payload: TokenPayload = {
                name,
                userId: newUser._id,
            };

            const token = await JWTUtil.sign(payload, process.env.SECRET_CODE);

            // TODO: FIX THIS.
            if (!token) {
                throw new Errors.InternalServerError("Error signing JWT");
            }

            const userRegisterResponse: UserRegisterResponse = {
                userId: newUser._id,
                token,
                username,
                name,
            };

            return userRegisterResponse;
        } catch (error) {}
    }

    public async loginUser(userLoginRequest: UserLoginRequest): Promise<UserLoginResponse> {
        const { username, password } = userLoginRequest;
        let errors = {};
    
        try {
            const user = await this.userDAO.findOne({ username });
            if (!user) {
                errors = { username: "Incorrect Username or Password" };
                throw new Errors.AuthError(errors, 400);
            }
    
            const validPassword = await BcryptUtil.comparePassword(password, user.password);
            if (!validPassword) {
                errors = { password: "Incorrect Username or Password" };
                throw new Errors.AuthError(errors, 400);
            }
    
            const userProfile = await this.userProfileDAO.findOne({ userId: user._id });
            if (!userProfile) {
                this.logger.logError(`User profile not found for user: ${username}`);
                throw new Errors.InternalServerError("User profile not found");
            }
    
            const payload: TokenPayload = {
                name: userProfile.name,
                userId: user._id,
            };
    
            const token = await JWTUtil.sign(payload, process.env.SECRET_CODE);
            if (!token) {
                throw new Errors.InternalServerError("Error signing JWT");
            }
    
            this.logger.logInfo("User logged in", { username, userId: user._id });
    
            return {
                userId: user._id,
                token,
                username,
                name: userProfile.name,
            };
        } catch (err) {
            // Type check the error before passing to logError
            if (err instanceof Error) {
                this.logger.logError("Login failed", err);
            } else {
                this.logger.logError("Login failed with unknown error", new Error(String(err)));
            }
            
            if (err instanceof Errors.AuthError) {
                throw err;
            }
            throw new Errors.InternalServerError("Unexpected error occurred during login");
        }
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
