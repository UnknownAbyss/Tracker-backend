const express = require("express");
const moment = require('moment-timezone');
const router = express.Router();

const Users = require("../models/user");
const PositionList = require("../models/positionList");

router.get("/", async (req, res) => {
  var date = req.query.date;
  if (date) {
    var reqdate = new Date(date);

    var today = moment(reqdate).utc().utcOffset("+05:30");
    var tomorrow = moment(reqdate).utc().utcOffset("+05:30").add(1, 'days');
    today.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    tomorrow.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    
    var posObj = await PositionList.find( {
      date: {
        $gte: today,
        $lt: tomorrow,
      }
    });

    var data = []
    for (var i = 0; i < posObj.length; i++) {
      var x = moment(posObj[i].start).utc().utcOffset("+05:30").format('LT');
      var y = moment(posObj[i].end).utc().utcOffset("+05:30").format('LT');
      data.push({
        user: posObj[i].user,
        dist: posObj[i].dist,
        start: x,
        end: y,
        pos: posObj[i].poslist,
      });
    };

    res.render('home', {results: data});
  } else {
    res.render('home');
  }
});


module.exports = router;
