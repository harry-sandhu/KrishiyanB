const axios = require("axios");

exports.lookupIFSC = async (ifscCode) => {
  try {
    const options = {
      method: "GET",
      url: `https://ifsc-lookup-api.p.rapidapi.com/${ifscCode}`,
      headers: {
        "x-rapidapi-key": "480611cfccmsh4332c8d4d13d839p10cfbfjsnd0af0158a9d4", // Replace with your actual API key
        "x-rapidapi-host": "ifsc-lookup-api.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    return response.data; // Return the response data for further use
  } catch (error) {
    console.error(
      "Error looking up IFSC:",
      error.response ? error.response.data : error.message
    );
    throw new Error("IFSC lookup failed");
  }
};
