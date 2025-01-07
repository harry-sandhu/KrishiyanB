const mongoose = require("mongoose");

const cropDataSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const CropData =
  mongoose.models.CropData || mongoose.model("CropData", cropDataSchema);

module.exports = CropData;
