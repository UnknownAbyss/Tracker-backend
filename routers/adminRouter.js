const express = require("express");
const moment = require('moment-timezone');
const router = express.Router();

const Users = require("../models/user");
const Admins = require("../models/admin")
const PositionList = require("../models/positionList");
const jwt = require("jsonwebtoken");
const { backauth } = require("../controllers/auth");

router.get("/", (req, res) => {
  return res.redirect("/admin/login");
})

router.get("/login", backauth, async (req, res) => {
  if (!req.rawauth){
    return res.render("login");
  }
  return res.redirect("/admin/home");
})

router.post("/login", async (req, res) => {
  let us = req.body.user;
  let pw = req.body.pass;

  if (!us || !pw) {
    return res.render("login", {msg: "Did not enter credentials"});
  }
  
  let user = await Admins.findOne({user: us, pass: pw});
  if (!user) {
    return res.render("login", {msg: "Invalid credentials"});
  }

  let token = jwt.sign({user: user.user, admin: user.admin}, process.env.JWT);

  res.setHeader('Set-Cookie', `token=${token}`);
  return res.redirect("login");
})

router.get("/home", backauth, async (req, res) => {
  try {
    if (!req.rawauth){
      return res.redirect("/admin/login");
    }
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
      let users = await Users.find({}).sort({user: 1});
      
      var myMap = new Map();
      for (let i = 0; i < posObj.length; i++) {
        myMap.set(posObj[i].user, posObj[i]);
      }
      
      var data = [];
      
      for (let i = 0; i < users.length; i++) {
        if (myMap.has(users[i].user)) {
          let temp = myMap.get(users[i].user);
          var x = moment(temp.start).utc().utcOffset("+05:30").format('LT');
          var y = moment(temp.end).utc().utcOffset("+05:30").format('LT');
          data.push({
            user: temp.user,
            dist: temp.dist,
            start: x,
            end: y,
            pos: temp.poslist,
            geometry: temp.geometry
          });
        } else {
          data.push({
            user: users[i].user,
            dist: 0,
            start: "-",
            end: "-",
            pos: [],
            geometry: ""
          });
        }
      }
      return res.render('home', {results: data, date: reqdate.getTime(), admin: req.priv});
    } else {
      return res.render('home', {admin: req.priv});
    }
  } catch(err) {
    res.send(`Error Occured: ${err}`);
  }
});

router.get("/accounts", backauth, async (req, res) => {
  try {
    if (!req.rawauth || !req.priv){
      return res.redirect("/admin/home");
    }
    let users = await Users.find();
    return res.render('accounts', {msg: '', users: users, admin: req.priv});
  } catch(err) {
    res.send('Error Occured');
  }
});

router.post("/accounts", backauth, async (req, res) => {
  try {
    if (!req.rawauth || !req.priv){
      return res.redirect("/admin/home");
    }
    let { user, pass } = req.body;
    let userObj = await Users.findOne({ user });
    if (userObj) {
      let users = await Users.find();
      return res.render('accounts', {msg: 'User already exists', users: users, admin: req.priv});
    }
    
    userObj = await Users.create({ user, pass });
    let users = await Users.find();
    return res.render('accounts', {msg: 'Account created', users: users, admin: req.priv});
  } catch (err) {
    res.send('Error Occured');
  }
});

router.get("/delete", backauth, async (req, res) => {
  try {
    if (!req.rawauth || !req.priv){
      return res.redirect("/admin/home");
    }
    let {user} = req.query;
    await Users.deleteOne({ user });
    return res.redirect('/admin/accounts');
  } catch (err) {
    res.send('Error Occured');
  }
});


module.exports = router;
