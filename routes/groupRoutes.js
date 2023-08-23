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
  console.log("Request: ", req.body);
  const { name, userId } = req.body;
  console.log("UserId: ", userId);
  const group = new Group({ name });
  group.users.push(userId);
  await group.save();

  console.log("Saved");

  return res.status(201).json({ success: true });
});

module.exports = router;
