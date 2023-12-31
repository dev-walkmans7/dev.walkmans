var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const bools = [true, false];
const registertype = ["normal", "google"];
const deviceType = ["ios", "android", "web"];

var UserSchema = new Schema(
  {
    full_name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    password: { type: String, default: "" },
    country_code: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    role: { type: Schema.Types.ObjectId, ref: "Role", default: null },
    profile_pic: { type: String, default: "" },
    social_id: { type: String, default: "" },
    deviceType: { type: String, enum: deviceType },
    deviceToken: { type: String, default: "" },
    register_type: { type: String, default: "normal", enum: registertype },
    last_active: { type: Date, default: null },
    last_login_date: { type: Date, default: null },
    timeStampOTP: { type: String, default: "" },
    emailOTP: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false, enum: bools },
    isTwoFactorEnaled: { type: Boolean, default: false, enum: bools },
    isProfileComplete: { type: Boolean, default: false, enum: bools },
    isActive: { type: Boolean, default: true, enum: bools },
    isDeleted: { type: Boolean, default: false, enum: bools },
  },
  { timestamps: true, versionKey: false }
);

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
  //bcrypt.compare(jsonData.password, result[0].pass
};

// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model("User", UserSchema);
