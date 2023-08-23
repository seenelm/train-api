const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateUser } = require("../__middleware__/validateUser");

// Get user's groups.
router.get("/:userId", async (req, res) => {
  try {
    console.log("User ID: ", req.params.userId);
    const user = await User.findById(req.params.userId).populate("groups");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Groups: ", user.groups);
    return res.status(201).json({ groups: user.groups });
  } catch (error) {
    return res.status(503);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    let errors = {};

    if (!username && !password) {
      errors = {
        username: "Username is required",
        password: "Password is required",
      };
      return res.status(400).json({ errors });
    } else if (!username) {
      errors = { username: "Username is required" };
      return res.status(400).json({ errors });
    } else if (!password) {
      errors = { password: "Password is required" };
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({ username });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        return res.status(201).json({ success: true, userId: user._id });
      } else {
        errors = { message: "Incorrect Username or Password" };
        return res.status(400).json({ errors });
      }
    } else {
      errors = { message: "Incorrect Username or Password" };
      return res.status(400).json({ errors });
    }
  } catch (error) {
    return res.status(503).json({ error: "Error Logging in User" });
  }
});

router.post("/signup", validateUser, async (req, res) => {
  try {
    const { username, password, name } = req.body;
    console.log(req.body);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      let errors = { username: "username already taken" };

      return res.status(409).json({ errors });
    } else {
      const hash = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        password: hash,
        name,
      });
      await newUser.save();

      return res.status(201).json({ success: true, userId: newUser._id });
    }
  } catch (error) {
    return res.status(503).json({ error: "Error Adding User" });
  }
});

module.exports = router;
