const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name can't be black"],
  },
  username: {
    type: String,
    required: [true, "Username can't be blank"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password can't be blank"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
