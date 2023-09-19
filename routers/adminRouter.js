const express = require("express");
const moment = require('moment-timezone');
const router = express.Router();

const Users = require("../models/user");
const PositionList = require("../models/positionList");

router.get("/", async (req, res) => {
  try {
    var date = req.query.date;
    if (date) {
      var reqdate = new Date(date);
  
      var today = moment(reqdate);
      var tomorrow = moment(reqdate);
      today = today.utcOffset("+05:30");
      tomorrow = tomorrow.utcOffset("+05:30").add(1, "days");
      today.set({hour: 7, minute: 0, second: 0, millisecond: 0});
      tomorrow.set({hour: 7, minute: 0, second: 0, millisecond: 0});
      
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
  
      return res.render('home', {results: data, date: reqdate.getTime()});
    } else {
      return res.render('home');
    }
  } catch(err) {
    res.send('Error Occured');
  }
});

router.get("/accounts", async (req, res) => {
  try {
    let users = await Users.find();
    return res.render('accounts', {msg: '', users: users});
  } catch(err) {
    res.send('Error Occured');
  }
});

router.post("/accounts", async (req, res) => {
  try {
    let { user, pass } = req.body;
    let userObj = await Users.findOne({ user });
    if (userObj) {
      let users = await Users.find();
      return res.render('accounts', {msg: 'User already exists', users: users});
    }
    
    userObj = await Users.create({ user, pass });
    let users = await Users.find();
    return res.render('accounts', {msg: 'Account created', users: users});
  } catch (err) {
    res.send('Error Occured');
  }
});

router.get("/delete", async (req, res) => {
  try {
    let {user} = req.query;
    await Users.deleteOne({ user });
    return res.redirect('/admin/accounts');
  } catch (err) {
    res.send('Error Occured');
  }
});


module.exports = router;
