const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
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

      const payload = {
        name: newUser.name,
        id: newUser._id,
      };

      const token = jwt.sign(payload, process.env.SECRET_CODE);

      return res
        .status(201)
        .json({ success: true, userId: newUser._id, token: token });
    }
  } catch (error) {
    return res.status(503).json({ error: "Error Adding User" });
  }
};

module.exports.login = async (req, res) => {
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
        const payload = {
          name: user.name,
          id: user._id,
        };
        const token = jwt.sign(payload, process.env.SECRET_CODE);
        return res
          .status(201)
          .json({ success: true, userId: user._id, token: token });
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
};
