import { NextFunction, Request, Response } from "express";
import UserService from "../service/UserService";
import { Types } from "mongoose";
import { UserLoginRequest } from "../dto/userRequest";
import { UserLoginResponse, UserRegisterResponse } from "../dto/userResponse";
import UserRegisterRequest from "../dto/UserRegisterRequest";

export default class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRegisterRequest: UserRegisterRequest =
                UserRegisterRequest.builder()
                    .setUsername(req.body.username)
                    .setPassword(req.body.password)
                    .setName(req.body.name)
                    .build();

            const userRegisterResponse: UserRegisterResponse =
                await this.userService.registerUser(userRegisterRequest);

            return res.status(201).json(userRegisterResponse);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userLoginRequest: UserLoginRequest = req.body;

            const userLoginResponse: UserLoginResponse =
                await this.userService.loginUser(userLoginRequest);
            return res.status(201).json(userLoginResponse);
        } catch (error) {
            next(error);
        }
    };

    findUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            let id = new Types.ObjectId(userId);
            const user = await this.userService.findUserById(id);
            return res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    deleteUserAccount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { userId } = req.params;
        let userID = new Types.ObjectId(userId);

        try {
            await this.userService.deleteUserAccount(userID);
            return res.status(201).json({ success: true });
        } catch (error) {
            next(error);
        }
    };
}
