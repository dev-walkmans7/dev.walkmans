const userModel = require("../model/userModel.js");
const jobModel = require("../model/jobModel.js");
const userRepository = require("../repositories/userRepo.js");
const userRepo = require("../repositories/userRepo.js");

const User = userModel();
const Job = jobModel();

class jobController {
  jobController() {}

  async jobPost(req, res) {
    try {
      //COMPANY NAME MISSING
      if (
        req.body.company_name === "" ||
        req.body.company_name === null ||
        req.body.company_name === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Company Name cannot be empty",
        });
      }

      //JOB TITLE IS MISSING
      if (
        req.body.job_title === "" ||
        req.body.job_title === null ||
        req.body.job_title === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Job Title cannot be empty",
        });
      }

      //SALARY IS MISSING
      if (
        req.body.salary === "" ||
        req.body.salary === null ||
        req.body.salary === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Salary cannot be empty",
        });
      }

      //EXPERIENCE IS MISSING
      if (
        req.body.experience === "" ||
        req.body.experience === null ||
        req.body.experience === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Experience cannot be empty",
        });
      }

      //JOB TYPE IS MISSING
      if (
        req.body.job_type === "" ||
        req.body.job_type === null ||
        req.body.job_type === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Job Type cannot be empty",
        });
      }

      //JOB DESCRIPTION IS MISSING
      if (
        req.body.job_description === "" ||
        req.body.job_description === null ||
        req.body.job_description === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Job Description cannot be empty",
        });
      }

      //COMPANY INFO IS MISSING
      if (
        req.body.company_info === "" ||
        req.body.company_info === null ||
        req.body.company_info === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Compny Information cannot be empty",
        });
      }

      //APPLICATION LINK IS MISSING
      if (
        req.body.application_link === "" ||
        req.body.application_link === null ||
        req.body.application_link === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Application Link cannot be empty",
        });
      }

      const userData = await userRepo.getById(req.user.id);

      if (Object.keys(userData).length === 0) {
        return res.status(201).send({
          data: {},
          message: "User not found!",
        });
      }

      const newJobPost = req.body;
      const newJob = { ...newJobPost, user: req.user.id };
      let jobEntry = await new jobModel(newJob).save();

      if (Object.keys(jobEntry).length > 0) {
        return res.status(200).send({
          data: jobEntry,
          message: "Job Posted Successfully!",
        });
      } else {
        return res.status(201).send({
          data: {},
          message: "Job Not Posted!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }
}

module.exports = new jobController();
