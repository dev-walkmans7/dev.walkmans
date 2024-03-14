const express = require("express");
const routeLlabel = require("route-label");
const router = express.Router();
const earlyAccessController = require("../controller/earlyAccessController.js");

router.post("/early-access/collect-data", earlyAccessController.collectData);

module.exports = router;
