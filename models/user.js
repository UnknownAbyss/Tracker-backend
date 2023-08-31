const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Username is required"],
  },
  pass: {
    type: String,
    required: [true, "Pass is required"],
  },
});

const Users = mongoose.model("user", UserSchema);
module.exports = Users;
