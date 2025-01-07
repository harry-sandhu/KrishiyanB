const axios = require("axios");

exports.verifyGST = async (gstNumber) => {
  try {
    const options = {
      method: "POST",
      url: "https://gst-verification-api-at-lowest-price.p.rapidapi.com/api/validation/verify_gst",
      headers: {
        "x-rapidapi-key": "480611cfccmsh4332c8d4d13d839p10cfbfjsnd0af0158a9d4",
        "x-rapidapi-host":
          "gst-verification-api-at-lowest-price.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        gstin: gstNumber,
        consent: "y",
        consent_text:
          "I hereby declare my consent agreement for fetching my information via AITAN Labs API",
      },
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying GST:",
      error.response ? error.response.data : error.message
    );
    throw new Error("GST verification failed");
  }
};
