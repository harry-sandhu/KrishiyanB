const express = require("express");
const {
  addSensor,
  updateSensor,
  getSensorsByContact,
  getSensorById,
  getSensorByContactAndField,
} = require("../controllers/proSensor");
const router = express.Router();

// Route to add a new sensor
router.post("/sensors/add", addSensor);

// Route to update an existing sensor
router.put("/update/:sensorId", updateSensor);

// Route to get sensors by contact number
router.get("/contact/:contactNumber", getSensorsByContact);
router.get("/sensors/:contactNumber/:fieldId", getSensorByContactAndField);
// Route to get sensor data by sensor ID
router.get("/:sensorId", getSensorById);

module.exports = router;
