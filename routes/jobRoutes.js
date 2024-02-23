const express = require("express");
const routeLlabel = require("route-label");
const router = express.Router();
const { requireSignIn } = require("../middlewares/middleware.js");

const jobController = require("../controller/jobConroller.js");

router.post("/job/new/post", requireSignIn, jobController.jobPost);

module.exports = router;
