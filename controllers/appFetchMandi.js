const axios = require("axios");
const MandiPrice = require("../models/mandiPrices"); // Adjust the path as needed

// URL of the API
const apiUrl =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001f665d8c53ebc4d9f7c6cbee1f85aa583&format=json&limit=10000";

const fetchAndSaveMandiPrices = async (req, res) => {
  try {
    // Fetch data from API
    const response = await axios.get(apiUrl);

    const records = response.data.records;
    console.log(records);

    if (!Array.isArray(records)) {
      return res
        .status(400)
        .json({ message: "Invalid data format received from API." });
    }

    // Convert records to the format needed by MandiPrice schema
    const mandiPriceData = records.map((record) => {
      return {
        state: record.state || "N/A",
        district: record.district || "N/A",
        market: record.market || "N/A",
        commodity: record.commodity || "N/A",
        variety: record.variety || "N/A",
        grade: record.grade || "N/A",
        arrival_date: record.arrival_date || "N/A",
        min_price: parseFloat(record.min_price) || 0,
        max_price: parseFloat(record.max_price) || 0,
        modal_price: parseFloat(record.modal_price) || 0,
      };
    });

    // Insert data into MongoDB
    await MandiPrice.insertMany(mandiPriceData);

    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error fetching and saving mandi prices:", error);
    res.status(500).json({ message: "Failed to fetch and save data." });
  }
};

module.exports = {
  fetchAndSaveMandiPrices,
};
