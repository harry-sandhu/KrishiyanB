// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const OTP = require("../models/Otp");
const axios = require("axios"); // Use axios instead of node-fetch

// Helper function to generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Generate a new OTP
  const otp = generateOtp();

  const options = {
    method: "POST",
    headers: {
      clientId: "MPF3JA7NMQY3XUAF3MHYC5EZVH418FGV",
      clientSecret: "0yrogpuf0x1zhfm0t5mnp5kpg85zgxgy",
      "Content-Type": "application/json",
    },
    data: {
      phoneNumber,
      message: `Your OTP is ${otp}`,
    },
    url: "https://marketing.otpless.app/v1/api/send",
  };

  try {
    // Send OTP using external API
    const response = await axios(options);
    const data = response.data;

    if (response.status === 200) {
      // Save OTP to the database
      const otpEntry = new OTP({ phoneNumber, otp });
      await otpEntry.save();

      console.log("OTP entry saved:", otpEntry);
      return res
        .status(200)
        .json({ message: "OTP sent and saved successfully" });
    } else {
      return res
        .status(response.status)
        .json({ error: data.error || "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
