const mongoose = require("mongoose");

let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGO, options).then(
  () => console.log("Connection established"),
  (err) => console.log(err)
);

mongoose.connection.on("error", (err) => {
  console.log(err);
});

mongoose.Promise = global.Promise;
