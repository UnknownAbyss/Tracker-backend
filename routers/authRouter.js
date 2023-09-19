const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Users = require("../models/user");
const { authorized } = require("../controllers/auth");

router.get("/", (req, res) => {
  res.json({ msg: "auth: pong" });
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
  } catch (e) {
    return res.status(500).json({
      msg: "Server Error",
      token: "",
      code: -1,
    });
  }
});

router.post("/verify", authorized, (req, res) => {
  try {
    if (req.rawauth) {
      return res.json({
        user: req.rawuser,
        code: 0,
      });
    }
  
    return res.json({
      user: "",
      code: 1,
    });
  } catch(e) {
    return res.status(500).json({
      user: "",
      code: -1,
    });
  }
});

module.exports = router;
