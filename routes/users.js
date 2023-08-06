const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateUser } = require("../__middleware__/validateUser");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      return res.status(201).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ errorMessage: "Incorrect Username or Password" });
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
