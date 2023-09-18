const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const authorized = async (req, res, next) => {
  req.rawauth = false;
  req.rawuser = "";
  
  try {
    if (req.body?.token == undefined || req.body?.token == null) {
      console.log("Not token found");
      return next();
    }
    
    await jwt.verify(req.body.token, process.env.JWT, async (err, decoded) => {
      if (err) {
        console.log("Token invalid");
      } else {
        console.log("Token valid bhai " + decoded.user);
        var x = await Users.exists({user: decoded.user});
        if (x) {
          console.log("User exists bhai " + decoded.user);
          req.rawauth = true;
          req.rawuser = decoded.user;
        }
      }
    });
    
    return next();
  } catch (e) {
    next(e);
  }
};

module.exports = { authorized };
