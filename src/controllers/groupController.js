import Group from "../models/group.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// Add group to associated Users model.
export const addGroup = async (req, res) => {
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
    return res.status(503).json({ error: error.message });
  }
};

// Request to join private group.
export const requestGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Check if group exists.
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is already member of group.
    if (group.users.includes(userId)) {
      return res.status(400).json({ error: "User is already member of group" });
    }

    // Check if user already sent a request.
    const existingRequest = group.requests.some((request) =>
      userId.equals(request._id)
    );

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    group.requests.push(userId);
    await group.save();

    return res.status(201).json({ status: "pending" });

    // Check if user already sent a request.
  } catch (error) {
    console.log(error);
    res.status(503).json(error.message);
  }
};

// Owner of private group confirms users request to join group.
export const confirmGroupRequest = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    console.log("Owner Id: ", ownerId);

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Verify owner of the group
    if (!ownerId.equals(group.owner)) {
      return res.status(403).json({ error: "Unauthorized user " });
    }

    // add user to group
    group.users.push(userId);
    await group.save();

    // remove user from requests array
    await Group.findOneAndUpdate(
      { _id: groupId },
      { $pull: { requests: { _id: userId } } },
      { new: true }
    );

    return res.status(201).json({ success: true });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

// Join public group.
export const joinPublicGroup = async (req, res) => {};

// Delete group if you are owner of group.
export const deleteGroup = async (req, res) => {};

// Leave group.
export const leaveGroup = async (req, res) => {};
