const User = require("../models/user");
const Group = require("../models/group");

// Find user's groups.
module.exports.showGroups = async (req, res) => {
  try {
    console.log("User ID: ", req.params.userId);
    const user = await User.findById(req.params.userId).populate("groups");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGroups = user.groups.map((group) => ({
      id: group._id,
      name: group.name,
      // owner: group.owner,
    }));

    console.log("Groups: ", user.groups);
    return res.status(201).json({ groups: userGroups });
  } catch (error) {
    return res.status(503);
  }
};

// Search for user.
module.exports.findUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const searchUsers = await User.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    const users = searchUsers.map((user) => ({
      username: user.username,
      name: user.name,
    }));

    res.status(201).json(users);
  } catch (error) {
    return res.status(503);
  }
};

// Send request to join group.
module.exports.requestGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    group.users.push(userId);

    await group.save();

    res.status(201).json({ message: "User added to group" });
  } catch (error) {
    return res.status(503);
  }
};
