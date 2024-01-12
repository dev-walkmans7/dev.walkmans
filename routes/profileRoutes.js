const express = require("express");
const routeLlabel = require("route-label");
const router = express.Router();
const { requireSignIn } = require("../middlewares/middleware.js");

const profileController = require("../controller/profileController.js");

router.post(
  "/profile/update-profile",
  requireSignIn,
  profileController.updateProfile
);
// router.post("/profile/test", requireSignIn, profileController.test);

module.exports = router;
