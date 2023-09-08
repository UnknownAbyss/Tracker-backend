const jwt = require("jsonwebtoken");

const authorized = (req, res, next) => {

  if (req.body?.token == undefined) {
    console.log("Not token found");
    req.rawauth = false;
    req.rawuser = "";
    return next();
  }
  
  jwt.verify(req.body.token, process.env.JWT, (err, decoded) => {
    if (err) {
      console.log("Token invalid");
      req.rawauth = false;
      req.rawuser = "";
    } else {
      console.log("Token valid bhai");
      req.rawauth = true;
      req.rawuser = decoded.user;
    }
  });
  
  return next();
};

module.exports = { authorized };
