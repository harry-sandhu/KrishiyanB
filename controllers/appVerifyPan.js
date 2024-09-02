const axios = require("axios");

// Controller function for verifying PAN
const verifyPAN = async (req, res) => {
  const { pan } = req.body;

  if (!pan) {
    return res.status(400).json({ error: "PAN is required" });
  }

  const options = {
    method: "POST",
    url: "https://pan-card-verification-at-lowest-price.p.rapidapi.com/verification/marketing/pan",
    headers: {
      "x-rapidapi-key": "480611cfccmsh4332c8d4d13d839p10cfbfjsnd0af0158a9d4",
      "x-rapidapi-host": "pan-card-verification-at-lowest-price.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      PAN: pan, // Use the PAN value from the request body
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error verifying PAN:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to verify PAN",
      details: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = {
  verifyPAN,
};
