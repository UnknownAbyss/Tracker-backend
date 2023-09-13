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
  dist: {
    type: Number,
  }
});

const PositionList = mongoose.model("positionList", PositionListSchema);
module.exports = PositionList;
