const express = require("express");
const router = express.Router();
const cropController = require("../controllers/appCropAdvisory");

// Route to get all crop names
router.get("/all/crops", cropController.getAllCropNames);

// Route to get detailed information based on crop name
router.get("/cropadvisory/crops/:name", cropController.getCropDetailsByName);
// Route to get varity by localName
router.get("/varity/:localName", cropController.getVarityByLocalName);

module.exports = router;
