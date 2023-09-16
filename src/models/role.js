const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  role: {
    type: String,
    enum: ["Owner", "Client"],
  },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
