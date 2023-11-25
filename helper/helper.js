const mongoose = require("mongoose");
const userModel = mongoose.model("User");
var moment = require("moment");
const slugify = require("slugify");
class Helper {
  constructor() {}
  async isEmailAvailable(email) {
    let emailAvailable = userModel.findOne({ email: email });
    if (emailAvailable) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = new Helper();
