var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const JobPostSchema = new Schema({
  company_name: { type: String, default: "" },
  company_image: { type: String, default: "" },
  job_title: { type: String, default: "" },
  salary: { type: String, default: "" },
  experience: { type: String, default: "" },
  job_type: { type: String, default: "" },
  job_description: { type: String, default: "" },
  company_info: { type: String, default: "" },
  image: { type: String, default: "" },
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },
  application_link: { type: String, default: "" },
});

module.exports = mongoose.model("Job", JobPostSchema);
