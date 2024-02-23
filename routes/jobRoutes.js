const express = require("express");
const routeLlabel = require("route-label");
const router = express.Router();
const { requireSignIn } = require("../middlewares/middleware.js");

const jobController = require("../controller/jobController.js");

router.post("/job/new/post", requireSignIn, jobController.jobPost);

router.post("/job/update/post/:jobId", requireSignIn, jobController.updateJobPost)
router.delete("/job/delete/post/:jobId", requireSignIn, jobController.deleteJobPost)

module.exports = router