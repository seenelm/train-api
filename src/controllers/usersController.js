const User = require("../models/user");
const Group = require("../models/group");

// Find user's groups.
module.exports.fetchGroups = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("groups");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGroups = user.groups.map((group) => ({
      id: group._id,
      name: group.name,
    }));

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

// Request to follow users private account.
module.exports.requestUser = async (req, res) => {};

module.exports.confirmUserRequest = async (req, res) => {};

module.exports.deleteAccount = async (req, res) => {};
