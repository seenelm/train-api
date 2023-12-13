import { Request, Response, NextFunction } from "express";
import GroupService from "../services/GroupService";
import GroupDAO from "../dataAccess/GroupDAO";
import { GroupModel } from "../models/groupModel";
import UserGroupsDAO from "../dataAccess/UserGroupsDAO";
import { UserGroupsModel } from "../models/userGroups";
import { Types } from "mongoose";

const groupDAO = new GroupDAO(GroupModel);
const userGroupsDAO = new UserGroupsDAO(UserGroupsModel);

const groupService = new GroupService(groupDAO, userGroupsDAO);

// Add group to associated Users model.
export const addGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupName, userId } = req.body;
    const userID = new Types.ObjectId(userId);

    const group = await groupService.addGroup(groupName, userID);
    return res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

export const fetchGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  let id = new Types.ObjectId(groupId);
  try {
    const group = await groupService.fetchGroup(id);
    return res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

export const updateGroupProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  const { groupBio, groupName, accountType } = req.body;

  const ownerId = req.user.id;
  const groupID = new Types.ObjectId(groupId);

  try {
    const group = await groupService.updateGroupProfile(
      ownerId,
      groupID,
      groupBio,
      groupName,
      accountType
    );
    return res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

export const updateGroupBio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupBio } = req.body;
  const { groupId } = req.params;

  const userID = req.user.id;
  const groupID = new Types.ObjectId(groupId);
  try {
    await groupService.updateGroupBio(userID, groupID, groupBio);
    return res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateGroupName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupName } = req.body;
  const { userId, groupId } = req.params;

  const userID = new Types.ObjectId(userId);
  const groupID = new Types.ObjectId(groupId);
  try {
    await groupService.updateGroupName(userID, groupID, groupName);
    return res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};
