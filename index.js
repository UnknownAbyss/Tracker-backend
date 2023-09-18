const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/init");

const adminRouter = require("./routers/adminRouter");
const authRouter = require("./routers/authRouter");
const locationRouter = require("./routers/locationRouter");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", authRouter);
app.use("/location", locationRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({ msg: "Test successful" });
});

app.use((req, res, next) => {
  const error = new Error(`Request not found: ${req.url}`);
  error.status = 404;
  next(error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
