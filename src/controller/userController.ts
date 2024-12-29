import { NextFunction, Request, Response } from "express";
import UserService from "../service/UserService";
import UserDAO from "../dao/UserDAO";
import UserProfileDAO from "../dao/UserProfileDAO";
import UserGroupsDAO from "../dao/UserGroupsDAO";
import FollowDAO from "../dao/FollowDAO";
import { UserModel } from "../model/userModel";
import { UserProfileModel } from "../model/userProfile";
import { UserGroupsModel } from "../model/userGroups";
import { FollowModel } from "../model/followModel";
import { Types } from "mongoose";
import { UserRegisterRequest, UserLoginRequest } from "../dto/userRequest";
import { UserLoginResponse, UserRegisterResponse } from "../dto/userResponse";

const userService = new UserService(
    new UserDAO(UserModel),
    new UserProfileDAO(UserProfileModel),
    new UserGroupsDAO(UserGroupsModel),
    new FollowDAO(FollowModel),
);

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userRegisterRequest: UserRegisterRequest = req.body;

        const userRegisterResponse: UserRegisterResponse =
            await userService.registerUser(userRegisterRequest);

        return res.status(201).json(userRegisterResponse);
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userLoginRequest: UserLoginRequest = req.body;

        const userLoginResponse: UserLoginResponse =
            await userService.loginUser(userLoginRequest);
        return res.status(201).json(userLoginResponse);
    } catch (error) {
        next(error);
    }
};

export const findUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        let id = new Types.ObjectId(userId);
        const user = await userService.findUserById(id);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUserAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.params;
    let userID = new Types.ObjectId(userId);

    try {
        await userService.deleteUserAccount(userID);
        return res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
};
