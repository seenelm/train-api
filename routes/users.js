const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateUser } = require("../__middleware__/validateUser");

router.post("/signup", validateUser, async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ errorMessage: "username already taken" });
    } else {
      const hash = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        password: hash,
      });
      await newUser.save();

      return res.status(201).json({ success: true, userId: newUser._id });
    }
  } catch (error) {
    return res.status(503).json({ error: "Error Adding User" });
  }
});

module.exports = router;
