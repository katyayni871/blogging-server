const mongoose = require("mongoose");

require("dotenv").config();

const dbconnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((e) => {
      console.log(e.message);
      process.exit(1);
    });
};

module.exports = dbconnect;
