const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./models/init");

const authRouter = require("./routers/authRouter");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || "utf8");
      }
    },
  })
);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ msg: "Test successful" });
});

app.use((req, res, next) => {
  const error = new Error("Request not found");
  error.status = 404;
  next(error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
