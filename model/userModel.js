var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const bools = [true, false];
const registertype = ["normal", "google"];
const deviceType = ["ios", "android", "web"];

const bioSchema = new Schema({
  full_name: { type: String, default: "" },
  headline: { type: String, default: "" },
  highlight: { type: String, default: "" },
});

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
    bio: { type: bioSchema, default: {} },
    about: { type: String, default: "" },
    skills: { type: Array, default: [] },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (next) {
  // console.log("hi");
  const user = this;
  if (user.isModified("full_name")) {
    user.bio = user.bio || {};
    user.bio.full_name = user.full_name;
  }
  if (user.bio.isModified("full_name")) {
    console.log("yes");
    user.full_name = user.bio.full_name;
    // await user.save();
  }

  next();
});

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
