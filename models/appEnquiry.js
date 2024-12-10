const mongoose = require("mongoose");

const CommoditySchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
  commodity: {
    type: String,
    required: true,
  },
  variety: {
    type: String,
  },
  quantity: {
    type: String,
    required: true,
  },
  moisture: {
    type: String,
  },
  localGradeSpecification: {
    type: String,
  },
  size: {
    type: String,
  },
  count: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  origin: {
    type: String,
  },
  location: {
    type: String,
  },
  photoVideoLink: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Commodity", CommoditySchema);
