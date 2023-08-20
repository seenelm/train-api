const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
