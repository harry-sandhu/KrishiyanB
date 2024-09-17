const Otp = require("../models/Otp");
const axios = require("axios");

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const otp = generateOtp();

    const otpEntry = new Otp({ phoneNumber, otp });
    await otpEntry.save();

    const apiPayload = {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGMzYzczMDY2MWQzM2U0NzJjOTQ4YiIsIm5hbWUiOiJEZWFsZXIgcmVnaXN0cmF0aW9uIiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY0NzQ2ZTg5ODhmNDI3MGJkOTgzMGM1MyIsImFjdGl2ZVBsYW4iOiJOT05FIiwiaWF0IjoxNzA4OTMyMjExfQ.Y8Y_7Z5-gD6LJbjbWXcJEgrcfK-r_3eXf6JP6JGF5NA", // replace with your actual apiKey
      campaignName: "OTP Verificatiom",
      destination: phoneNumber,
      userName: "Dealer registration",
      templateParams: [otp],
      source: "new-landing-page form",
      media: {},
      buttons: [
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
      carouselCards: [],
      location: {},
      paramsFallbackValue: {
        FirstName: phoneNumber,
      },
    };

    const response = await axios.post(
      " https://backend.aisensy.com/campaign/t1/api/v2",
      apiPayload
    );

    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        data: { otp },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
        error: {
          code: "OTP_SEND_FAILURE",
          description: "An error occurred while sending the OTP.",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: "SERVER_ERROR",
        description: error.message,
      },
    });
  }
};
