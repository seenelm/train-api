import UserRepository from "../../infrastructure/database/repositories/user/UserRepository";
import * as Errors from "../../utils/errors";
import JWTUtil from "../../utils/JWTUtil";
import BcryptUtil from "../../utils/BcryptUtil";
import { UserDocument } from "../../infrastructure/database/models/user/userModel";
import UserProfileDAO from "../../dao/UserProfileDAO";
import UserGroupsDAO from "../../dao/UserGroupsDAO";
import FollowDAO from "../../dao/FollowDAO";
import CustomLogger from "../../common/logger";
import { Types } from "mongoose";
import User from "../../infrastructure/database/entity/user/User";

import {
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
} from "./dto/userDto";

import mongoose from "mongoose";
import { APIError } from "../../common/errors/APIError";

export interface TokenPayload {
    name: string;
    userId: Types.ObjectId;
}

export default class UserService {
    private userRepository: UserRepository;
    private userProfileDAO: UserProfileDAO;
    private userGroupsDAO: UserGroupsDAO;
    private followDAO: FollowDAO;
    private logger: CustomLogger;

    constructor(
        userRepository: UserRepository,
        userProfileDAO: UserProfileDAO,
        userGroupsDAO: UserGroupsDAO,
        followDAO: FollowDAO,
    ) {
        this.userRepository = userRepository;
        this.userProfileDAO = userProfileDAO;
        this.userGroupsDAO = userGroupsDAO;
        this.followDAO = followDAO;
        this.logger = new CustomLogger(this.constructor.name);
    }

    public async registerUser(
        userRegisterRequest: UserRegisterRequest,
    ): Promise<UserResponse> {
        const username = userRegisterRequest.username;
        const password = userRegisterRequest.password;
        const name = userRegisterRequest.name;
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const existingUser: User = await this.userRepository.findOne({
                username,
            });
            if (existingUser) {
                throw APIError.Conflict("username already taken");
            }

            // Hash password
            const hash = await BcryptUtil.hashPassword(password);

            const newUser: User = await this.userRepository.create({
                username,
                password: hash,
                isActive: true,
            });

            await Promise.all([
                this.userProfileDAO.create(
                    {
                        userId: newUser.getId(),
                        name,
                        username,
                    },
                    { session },
                ),
                this.userGroupsDAO.create(
                    {
                        userId: newUser.getId(),
                    },
                    { session },
                ),
                this.followDAO.create(
                    {
                        userId: newUser.getId(),
                    },
                    { session },
                ),
            ]);

            const payload: TokenPayload = {
                name,
                userId: newUser.getId(),
            };

            const token = await JWTUtil.sign(payload, process.env.SECRET_CODE);

            // TODO: FIX THIS.
            if (!token) {
                throw APIError.InternalServerError(
                    "Failed to generate JWT authentication token",
                );
            }

            return this.userRepository.toResponse(newUser, token, name);
        } catch (error) {}
    }

    public async loginUser(
        userLoginRequest: UserLoginRequest,
    ): Promise<UserResponse> {
        const { username, password } = userLoginRequest;
        const user: User = await this.userRepository.findOne({ username });
        let errors = {};

        if (!user) {
            errors = { username: "Incorrect Username or Password" };
            throw new Errors.AuthError(errors, 400);
        }

        const validPassword = await BcryptUtil.comparePassword(
            password,
            user.getPassword(),
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
            userId: user.getId(),
        });

        const payload: TokenPayload = {
            name: userProfile.name,
            userId: user.getId(),
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

        // TODO: FIX THIS.
        if (!token) {
            throw new Errors.InternalServerError("Error signing JWT");
        }

        this.logger.logInfo("User logged in", {
            username,
            userId: user.getId(),
        });

        return this.userRepository.toResponse(user, token, userProfile.name);
    }

    // public async findUserById(userId: Types.ObjectId): Promise<IUser | null> {
    //     const user = await this.userRepository.findUserById(
    //         userId,
    //         "username isActive",
    //     );

    //     if (!user) {
    //         throw new Errors.ResourceNotFoundError("User not found", {
    //             userId,
    //         });
    //     }

    //     this.logger.logInfo("Find User By Id", { user });

    //     return user;
    // }

    // public async deleteUserAccount(userId: Types.ObjectId): Promise<void> {
    //     await this.userRepository.deleteUserAccount(userId);
    // }
}
