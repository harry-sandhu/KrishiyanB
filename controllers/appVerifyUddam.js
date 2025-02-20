const axios = require("axios");

exports.verifyUdyam = async (udyamNumber) => {
  try {
    const options = {
      method: "POST",
      url: "https://udyam-aadhaar-verification.p.rapidapi.com/v3/tasks/async/verify_with_source/udyam_aadhaar",
      headers: {
        "x-rapidapi-key": "480611cfccmsh4332c8d4d13d839p10cfbfjsnd0af0158a9d4",
        "x-rapidapi-host": "udyam-aadhaar-verification.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        udyamNumber: udyamNumber,
      },
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error verifying Udyam Aadhaar:", error);
    throw new Error("Udyam Aadhaar verification failed");
  }
};
