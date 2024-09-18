const express = require("express");
const router = express.Router();
const otpController = require("../controllers/Whatsappsms");

// Route to handle OTP generation and sending
router.post("/send-otp", otpController.sendOtp);
router.post("/check-otp", otpController.checkOtp);

module.exports = router;
