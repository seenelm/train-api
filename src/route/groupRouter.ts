import express from "express";
const groupRouter = express.Router();
import * as groupController from "../controller/groupController";
import { authenticate } from "../__middleware__/authenticate";

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

export default groupRouter;
