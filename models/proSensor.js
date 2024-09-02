const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  fieldId: { type: String }, // Use fieldId instead of fid
  contactNumber: { type: String },
  sensorId: { type: String },
  N: { type: Number }, // Nitrogen level
  P: { type: Number }, // Phosphorus level
  K: { type: Number }, // Potassium level
  pH: { type: Number }, // pH level
  rainfall: { type: Number }, // Rainfall level
  geoLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  date: { type: Date, default: Date.now }, // Date of the sensor data
});

module.exports = mongoose.model("Sensor", sensorSchema);
