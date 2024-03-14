const userModel = require("../model/userModel.js");
const jobModel = require("../model/jobModel.js");
const userRepository = require("../repositories/userRepo.js");
const userRepo = require("../repositories/userRepo.js");

const User = userModel();
const Job = jobModel();

class jobController {
  jobController() {}

  /*
   * /@Method: jobPost
   * /@Description:Post A Job
   */
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

  /*
   * /@Method: updateJobPost
   * /@Description:Update the Job already Posted
   */
  async updateJobPost(req, res) {
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

      if (!req.params.jobId) {
        return res.status(400).send({
          data: {},
          message: "Job ID is missing in URL parameters",
        });
      }
      // console.log(req.params.jobId);
      const updatedJobPost = req.body;
      let updatedJob = await jobModel.findByIdAndUpdate(
        req.params.jobId,
        updatedJobPost
      );

      if (Object.keys(updatedJob).length > 0) {
        return res.status(200).send({
          data: updatedJob,
          message: "Job Updated Successfully!",
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

  /*
   * /@Method: deleteJobPost
   * /@Description: Delete the job that has been posted
   */
  async deleteJobPost(req, res) {
    try {
      // Check if job ID is provided in URL parameters
      if (!req.params.jobId) {
        return res.status(400).send({
          data: {},
          message: "Job ID is missing in URL parameters",
        });
      }

      // Attempt to delete the job post
      const deletedJob = await jobModel.findByIdAndDelete(req.params.jobId);

      // Check if job post is deleted successfully
      if (deletedJob) {
        return res.status(200).send({
          data: deletedJob,
          message: "Job Deleted Successfully",
        });
      } else {
        return res.status(404).send({
          data: {},
          message: "Job Not Found or Already Deleted",
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

  /*
   * /@Method: getAllJobs
   * /@Description: List all the jobs present in descending order of creation time.
   */
  async getAllJobs(req, res) {
    try {
      const userData = await userRepo.getById(req.user.id);

      if (Object.keys(userData).length === 0) {
        return res.status(201).send({
          data: {},
          message: "User doesn't Exist!!",
        });
      }
      const jobList = await jobModel
        .find({})
        .select(
          "job_title company_name company_image job_type experience createdAt"
        )
        .sort({ createdAt: -1 });

      return res.status(200).send({
        data: jobList,
        message: "All Jobs!",
        results: jobList.length,
      });
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }

  /*
   * /@Method: getAllJobs
   * /@Description: List all the jobs present in descending order of creation time.
   */
  async getJobById(req, res) {
    try {
      // Check if job ID is provided in URL parameters
      if (!req.params.jobId) {
        return res.status(400).send({
          data: {},
          message: "Job ID is missing in URL parameters",
        });
      }

      const userData = await userRepo.getById(req.user.id);

      if (Object.keys(userData).length === 0) {
        return res.status(201).send({
          data: {},
          message: "User doesn't exist!",
        });
      }

      const job = await jobModel.findById(req.params.jobId);

      if (Object.keys(job).length === 0) {
        return res.status(201).send({
          data: {},
          message: "Job not found!",
        });
      }

      return res.status(200).send({
        data: job,
        message: "Job is listed!",
      });
    } catch (error) {
      res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }
}

module.exports = new jobController();
