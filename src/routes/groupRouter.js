import express from "express";
const groupRouter = express.Router();
import Group from "../models/group.js";
import UserModel from "../models/userModel.js";
import * as groupController from "../controllers/groupController.js";
import { authenticate } from "../__middleware__/authenticate.js";

groupRouter.post("/", authenticate, groupController.addGroup);

groupRouter.post(
  "/:groupId/requests",
  authenticate,
  groupController.requestGroup
);

groupRouter.post(
  "/:groupId/requests/:userId",
  authenticate,
  groupController.confirmGroupRequest
);

// Delete group.
// router.delete("/:groupId", async (req, res) => {
//   try {
//     const { roleId, userId } = req.body;
//     const { groupId } = req.params;
//     const group = await Group.findById(groupId);

//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     const owner = await Role.findById(roleId);
//     if (!owner) {
//       return res
//         .status(403)
//         .json({ error: "Only the Owner is allowed to delete the group" });
//     }

//     await Role.deleteMany({ group: groupId });
//     await Group.findByIdAndDelete(groupId);
//     await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

//     res.status(201).json({ message: "Group deleted" });
//   } catch (error) {
//     return res.status(503).json({ error: "Internal server error" });
//   }
// });

export default groupRouter;
