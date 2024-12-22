const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  commodities: {
    type: [String],
    required: true,
  },
});

const stateSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
    unique: true,
  },
  districts: [districtSchema],
});

const State = mongoose.model("State", stateSchema);

module.exports = State;
