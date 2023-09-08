const mongoose = require("mongoose");

const PositionListSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Username is required"],
  },
  poslist: {
    type: [Number]
  },
  date: {
    type: Date,
  },  
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  marked: {
    type: Boolean,
    default: false,
  },
});

const PositionList = mongoose.model("positionList", PositionListSchema);
module.exports = PositionList;
