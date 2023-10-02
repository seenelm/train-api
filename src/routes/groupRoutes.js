const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const User = require("../models/user");
const Role = require("../models/role");
const authenticate = require("../__middleware__/authenticate");

// Add group to database.
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const group = new Group({ name });
    group.owner = userId;
    user.groups.push(group._id);

    const savedGroup = await group.save();
    await user.save();

    const newGroup = {
      id: savedGroup._id,
      name: savedGroup.name,
    };

    return res.status(201).json({ success: true, newGroup: newGroup });
  } catch (error) {
    return res.status(503).json({ error: "Internal server error" });
  }
});

// Delete group.
router.delete("/:groupId", async (req, res) => {
  try {
    const { roleId, userId } = req.body;
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const owner = await Role.findById(roleId);
    if (!owner) {
      return res
        .status(403)
        .json({ error: "Only the Owner is allowed to delete the group" });
    }

    await Role.deleteMany({ group: groupId });
    await Group.findByIdAndDelete(groupId);
    await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

    res.status(201).json({ message: "Group deleted" });
  } catch (error) {
    return res.status(503).json({ error: "Internal server error" });
  }
});

module.exports = router;
