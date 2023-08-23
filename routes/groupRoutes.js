const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const User = require("../models/user");

router.get("/", async (req, res) => {
  const groups = await Group.find({});
  res.json({ groups });
});

// Add group to database.
router.post("/", async (req, res) => {
  try {
    const { name, userId } = req.body;
    const user = await User.findById(userId);
    console.log("User: ", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const group = new Group({ name });
    group.users.push(userId);
    user.groups.push(group._id);
    console.log("User: ", user);
    await group.save();
    await user.save();

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(503).json({ error: "Internal server error" });
  }
});

module.exports = router;
