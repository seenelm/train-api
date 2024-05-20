import SearchService from "../services/SearchService";
import SearchDAO from "../dataAccess/SearchDAO";
import { UserModel } from "../models/userModel";
import { GroupModel } from "../models/groupModel";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

const searchService = new SearchService(new SearchDAO(UserModel, GroupModel));

export const findUsersAndGroups = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { query } = req.query;
    const userId = new Types.ObjectId(req.user.userId);
    try {
        const users = await searchService.findUsersAndGroups(query, userId);
        return res.status(201).json(users);
    } catch (error) {
        next(error);
    }
};
