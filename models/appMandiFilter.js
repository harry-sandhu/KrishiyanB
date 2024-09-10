const mongoose = require("mongoose");

// Commodity schema for each district
const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  commodities: {
    type: [String], // Array of commodity names
    required: true,
  },
});

// State schema with districts and their commodities
const stateSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
    unique: true,
  },
  districts: [districtSchema], // Array of districts, each with its commodities
});

// Create the State model
const State = mongoose.model("State", stateSchema);

module.exports = State;
