const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userSchema } = require("../schemas");

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "username already taken" });
    }

    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      password: hash,
    });
    await newUser.save();
    res.status(201).json({ userId: newUser._id });
  } catch (error) {
    throw error;
  }
};
