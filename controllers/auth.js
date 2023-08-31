const jwt = require("jsonwebtoken");

const authorized = (req, res, next) => {
  if (req.body?.token == undefined) {
    req.rawauth = false;
    req.rawuser = "";
    next();
  }

  jwt.verify(req.body.token, process.env.JWT, (err, decoded) => {
    if (err) {
      req.rawauth = false;
      req.rawuser = "";
      next();
    } else {
      req.rawauth = true;
      (req.rawuser = decoded.user), next();
    }
  });

  req.rawauth = false;
  (req.rawuser = ""), next();
};

module.exports = { authorized };
