const mongoose = require("mongoose");

const CropCultivationSchema = new mongoose.Schema({
  dealerNumber: {
    type: String,
    required: true,
  },
  fid: {
    type: String,
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  crops: {
    type: String,
    required: true,
  },
  variety: {
    type: String,
  },
  dateOfSowing: {
    type: Date,
    required: true,
  },
  geolocation: {
    type: String,
  },
  typeOfCultivationPractice: {
    type: String,
    required: true,
  },
  areaInAcres: {
    type: Number,
    required: true,
  },
  geoLinkAreaOnMap: {
    type: String,
  },
});

module.exports = mongoose.model("CropCultivation", CropCultivationSchema);
