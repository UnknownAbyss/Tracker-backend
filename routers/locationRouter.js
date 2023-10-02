const express = require("express");
const jwt = require("jsonwebtoken");
const moment = require('moment-timezone');
const { authorized } = require("../controllers/auth");
const router = express.Router();

const Users = require("../models/user");
const PositionList = require("../models/positionList");
const { calcCrow, processLoc } = require("../controllers/dist");

router.get("/", (req, res) => {
  res.json({ msg: "location: pong" });
});

router.post("/login", async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({
      msg: "Server Error",
      token: "",
      code: -1,
    });
  }
});

router.post("/submit", authorized, async (req, res) => {
  try {
    let { positions, start, end, date } = req.body;
  
    if (!req.rawauth) {
      return res.json( {
        code: -1,
        msg: "User Authorization Failed",
        dist: -1,
      });
    }
  
    if (!positions || !start || !end || !date) {;
      return res.json( {
        code: -2,
        msg: "Invalid Request",
        dist: -1,
      });
    }
  
    var curdate = Date.now();
    var reqdate = new Date(date);
  
  
    var today = moment(curdate);
    var tomorrow = moment(curdate);
    today = today.utcOffset("-01:30");
    tomorrow = tomorrow.utcOffset("-01:30").add(1, "days");
    today.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    tomorrow.set({hour: 0, minute: 0, second: 0, millisecond: 0});
  
    if (today > reqdate || reqdate >= tomorrow) {
      return res.json( {
        code: -3,
        msg: "Clock not synced",
        dist: -1,
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
        msg: "Already Submitted",
        dist: -1,
      });
    }

    let posdata = []
    for (let i = 0; i < positions.length/2; i++) {
      posdata.push( [ positions[i*2], positions[i*2 + 1] ] )
    }

    let t = await processLoc(posdata);
    let geometry = t[0]
    let dist = t[1]

    if (dist == -1) {

      dist = 0;
      for (var i = 1; i < positions.length/2; i++) {
        dist += calcCrow(positions[i*2], positions[i*2 + 1], positions[i*2 - 2], positions[i*2 - 1]);
      }

      var temp = await PositionList.create({
        user: req.rawuser,
        date: reqdate,
        start: start,
        end: end,
        dist: dist/1000,
        poslist: positions,
        geometry: geometry
      });
    } else {
      var temp = await PositionList.create({
        user: req.rawuser,
        date: reqdate,
        start: start,
        end: end,
        dist: dist/1000,
        poslist: positions,
        geometry: ""
      });
    }
  
    return res.json( {
      code: 0,
      dist: dist,
      msg: "Submitted Successfully"
    });
  } catch (err) {
    console.log(err)
    return res.json( {
      code: -1,
      dist: -1,
      msg: "Server Error"
    });
  }
});

module.exports = router;
