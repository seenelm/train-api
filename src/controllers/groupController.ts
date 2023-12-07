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
    const { name, userId } = req.body;
    const userID = new Types.ObjectId(userId);

    const group = await groupService.addGroup(name, userID);
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

export const updateGroupBio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupBio } = req.body;
  const { userId, groupId } = req.params;

  const userID = new Types.ObjectId(userId);
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

// Request to join private group.
// export const requestGroup = async (req: Request, res: Response) => {
//   try {
//     const { groupId } = req.params;
//     const userId = new mongoose.Types.ObjectId(req.user.id);

//     // Check if group exists.
//     const group = await GroupModel.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     Check if user is already member of group.
//     if (group.users.includes(userId)) {
//       return res.status(400).json({ error: "User is already member of group" });
//     }

//     Check if user already sent a request.
//     const existingRequest = group.requests.some((request) =>
//       userId.equals(request._id)
//     );

//     if (existingRequest) {
//       return res.status(400).json({ error: "Request already sent" });
//     }

//     group.requests.push(userId);
//     await group.save();

//     return res.status(201).json({ status: "pending" });

//     Check if user already sent a request.
//   } catch (error) {
//     console.log(error);
//     res.status(503).json(error.message);
//   }
// };

// Owner of private group confirms users request to join group.
// export const confirmGroupRequest = async (req: Request, res: Response) => {
//   try {
//     const { groupId, userId } = req.params;
//     const ownerId = new mongoose.Types.ObjectId(req.user.id);
//     console.log("Owner Id: ", ownerId);

//     // Check if group exists
//     const group = await GroupModel.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Verify owner of the group
//     if (!ownerId.equals(group.owner)) {
//       return res.status(403).json({ error: "Unauthorized user " });
//     }

//     // add user to group
//     group.users.push(userId);
//     await group.save();

//     // remove user from requests array
//     await GroupModel.findOneAndUpdate(
//       { _id: groupId },
//       { $pull: { requests: { _id: userId } } },
//       { new: true }
//     );

//     return res.status(201).json({ success: true });
//   } catch (error) {
//     res.status(503).json({ error: error.message });
//   }
// };

// Join public group.
export const joinPublicGroup = async (req: Request, res: Response) => {};

// Delete group if you are owner of group.
export const deleteGroup = async (req: Request, res: Response) => {};

// Leave group.
export const leaveGroup = async (req: Request, res: Response) => {};
