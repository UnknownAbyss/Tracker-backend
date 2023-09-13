const express = require("express");
const jwt = require("jsonwebtoken");
const moment = require('moment-timezone');
const { authorized } = require("../controllers/auth");
const router = express.Router();

const Users = require("../models/user");
const PositionList = require("../models/positionList");

router.get("/", (req, res) => {
  res.json({ msg: "location: pong" });
});

router.post("/login", async (req, res) => {
  let { user, pass } = req.body;
  out = await Users.findOne({ user: user, pass: pass });

  if (out) {
    var token = jwt.sign({ user: out.user }, process.env.JWT);
    return res.json({
      msg: "Login successful",
      token: token,
      code: 0,
    });
  }

  return res.json({
    msg: "Login Error",
    token: "",
    code: 1,
  });
});

router.post("/submit", authorized, async (req, res) => {
  let { positions, start, end, date } = req.body;

  if (!req.rawauth) {
    return res.json( {
      code: -1,
      msg: "User Authorization Failed"
    });
  }

  if (!positions || !start || !end || !date) {;
    return res.json( {
      code: -2,
      msg: "Invalid Request"
    });
  }

  var curdate = Date.now();
  var reqdate = new Date(date);

  var today = moment(curdate).utc().utcOffset("+05:30");
  var tomorrow = moment(curdate).utc().utcOffset("+05:30").add(1, 'days');
  today.set({hour: 0, minute: 0, second: 0, millisecond: 0});
  tomorrow.set({hour: 0, minute: 0, second: 0, millisecond: 0});

  if (today > reqdate || reqdate >= tomorrow) {
    return res.json( {
      code: -3,
      msg: "Clock not synced"
    });
  }


  var posObj = await PositionList.findOne( {
    user: req.rawuser,
    date: {
      $gte: today,
      $lt: tomorrow,
    }
  });

  if (posObj) {
    console.log(posObj);
    return res.json( {
      code: 0,
      msg: "Already Submitted"
    });
  }
  
  var temp = await PositionList.create({
    user: "addi",
    date: reqdate,
    start: start,
    end: end,
    marked: true,
    poslist: positions
  });

  return res.json( {
    code: 0,
    msg: "Submitted Successfully"
  });

});

module.exports = router;
