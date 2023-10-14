const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  requests: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        default: "pending",
      },
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
