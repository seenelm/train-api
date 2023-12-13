import express from "express";
const groupRouter = express.Router();
import * as groupController from "../controllers/groupController";
import { authenticate } from "../__middleware__/authenticate";

groupRouter.get("/:groupId", authenticate, groupController.fetchGroup);

groupRouter.post("/", authenticate, groupController.addGroup);

// groupRouter.post(
//   "/:groupId/requests",
//   authenticate,
//   groupController.requestGroup
// );

// groupRouter.post(
//   "/:groupId/requests/:userId",
//   authenticate,
//   groupController.confirmGroupRequest
// );

groupRouter.put(
    "/:groupId/profile",
    authenticate,
    groupController.updateGroupProfile,
);

groupRouter.put("/:groupId/join", authenticate, groupController.joinGroup);

// groupRouter.put("/:groupId/bio", authenticate, groupController.updateGroupBio);
// groupRouter.patch(
//   "/:groupId/groupName",
//   authenticate,
//   groupController.updateGroupName
// );

export default groupRouter;
