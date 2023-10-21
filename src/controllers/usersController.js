import User from "../models/user.js";
import Group from "../models/group.js";

// Find user's groups.
export const fetchGroups = async (req, res) => {
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
export const findUsers = async (req, res) => {
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
export const requestUser = async (req, res) => {};

export const confirmUserRequest = async (req, res) => {};

export const deleteAccount = async (req, res) => {};
