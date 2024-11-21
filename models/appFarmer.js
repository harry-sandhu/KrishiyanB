const mongoose = require("mongoose");

const appFarmerSchema = new mongoose.Schema(
  {
    dealerNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
      unique: true,
    },
    totalOwnedFarm: {
      type: Number,
      required: true,
    },
    geoLocationOwnedFarm: {
      type: String,
    },
    totalLeaseFarm: {
      type: Number,
    },
    geoLocationLeaseFarm: {
      type: String,
    },
    pincode: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    typeOfCultivationPractice: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
    },
    accountName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    pan: {
      type: String,
    },
    aadhaarNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appFarmer", appFarmerSchema);
