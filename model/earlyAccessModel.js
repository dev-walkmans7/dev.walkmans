var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const earlyAccessSchema = new Schema({
  full_name: { type: String, default: "" },
  email: { type: String, default: "", unique: true },
});

module.exports = mongoose.model("EarlyAccess", earlyAccessSchema);
