import express from "express";
const groupRouter = express.Router();
import GroupController from "../controller/groupController";
import { authenticate } from "../middleware/authenticate";
import GroupService from "../service/GroupService";
import GroupDAO from "../dao/GroupDAO";
import { GroupModel } from "../model/groupModel";
import UserGroupsDAO from "../dao/UserGroupsDAO";
import { UserGroupsModel } from "../model/userGroups";
import ProgramService from "../app/programs/services/ProgramService";
import ProgramRepository from "../infrastructure/database/repositories/ProgramRepository";
import GroupMiddleware from "../common/middleware/GroupMiddleware";

const groupDAO = new GroupDAO(GroupModel);
const userGroupsDAO = new UserGroupsDAO(UserGroupsModel);
const programRepository = new ProgramRepository();

const groupService = new GroupService(groupDAO, userGroupsDAO);
const programService = new ProgramService(programRepository);
const groupController = new GroupController(groupService, programService);

const groupMiddleware = new GroupMiddleware(groupDAO);

groupRouter.get("/:groupId", authenticate, groupController.fetchGroup);

groupRouter.post("/", authenticate, groupController.addGroup);

groupRouter.post(
    "/:groupId/request",
    authenticate,
    groupController.requestToJoinGroup,
);

groupRouter.get(
    "/:groupId/request/profiles",
    authenticate,
    groupController.getJoinRequests,
);

groupRouter.get(
    "/:userId/requests",
    authenticate,
    groupController.getJoinRequestsByUser,
);

groupRouter.put(
    "/:groupId/profile",
    authenticate,
    groupController.updateGroupProfile,
);

groupRouter.put("/:groupId/join", authenticate, groupController.joinGroup);

// groupRouter.delete("/:groupId/delete", authenticate, groupController.deleteGroup);

groupRouter.post(
    "/:groupId/programs",
    authenticate,
    groupMiddleware.validateCreateProgram,
    groupController.createProgram,
);

export default groupRouter;
