const express = require("express");
const router = express.Router();
const cropDataController = require("../controllers/appInsightData");

// Create a new crop data entry
router.post("/cropdata", cropDataController.createCropData);

// Get all crop data
router.get("/cropdata", cropDataController.getAllCropData);

// Get crop data by name
router.get("/cropdata/:cropName", cropDataController.getCropDataByName);

// Update crop data value by name
router.put("/cropdata/:cropName", cropDataController.updateCropDataValue);

// Delete crop data by name
router.delete("/cropdata/:cropName", cropDataController.deleteCropData);

module.exports = router;
