import { Request, Response, NextFunction } from "express";
import GroupService from "../services/GroupService";
import GroupDAO from "../dataAccess/GroupDAO";
import { GroupModel } from "../models/groupModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import { Types } from "mongoose";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

const groupDAO = new GroupDAO(GroupModel);
const userGroupsDAO = new UserGroupsDAO(UserGroupsModel);

const groupService = new GroupService(groupDAO, userGroupsDAO);

// Add group to associated Users model.
export const addGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { groupName, userId } = req.body;
        const userID = new Types.ObjectId(userId);

        const group = await groupService.addGroup(groupName, userID);
        return res.status(HttpStatusCode.CREATED).json(group);
    } catch (error) {
        next(error);
    }
};

export const fetchGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { groupId } = req.params;
    let groupID = new Types.ObjectId(groupId);
    try {
        const group = await groupService.fetchGroup(groupID);
        return res.status(HttpStatusCode.OK).json(group);
    } catch (error) {
        next(error);
    }
};

export const updateGroupProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { groupId } = req.params;
    const { groupBio, groupName, accountType } = req.body;

    const ownerId = req.user.id;
    const groupID = new Types.ObjectId(groupId);

    try {
        await groupService.updateGroupProfile(
            ownerId,
            groupID,
            groupBio,
            groupName,
            accountType,
        );
        return res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const joinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { groupId } = req.params;

    const groupID = new Types.ObjectId(groupId);
    const userId = req.user.id;

    try {
        await groupService.joinGroup(userId, groupID);
        return res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
        next(error);
    }
};
