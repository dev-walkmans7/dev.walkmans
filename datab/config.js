const mongoose = require("mongoose");

const connection_string =
  "mongodb+srv://" +
  process.env.DBUSERNAME +
  ":" +
  process.env.PASSWORD +
  "@walkmans.urbphy7.mongodb.net?retryWrites=true&w=majority&appName=walkman";

let option = {
  auth: {
    username: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = () => {
  try {
    mongoose.connect(connection_string, option);
    console.log("DB connected successfully!");
  } catch (err) {
    console.log(err);
  }
};
