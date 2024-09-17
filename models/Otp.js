const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
    },

    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);
