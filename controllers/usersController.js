const User = require("../models/user");

// Get user's groups.
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
    }));

    console.log("Groups: ", user.groups);
    return res.status(201).json({ groups: userGroups });
  } catch (error) {
    return res.status(503);
  }
};
