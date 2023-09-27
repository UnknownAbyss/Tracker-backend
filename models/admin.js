const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Username is required"],
  },
  pass: {
    type: String,
    required: [true, "Pass is required"],
  },
  admin: Boolean
});

const Admins = mongoose.model("admin", AdminSchema);
module.exports = Admins;
