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

// Get Mandi Price data by state, district, commodity, and date range
const getMandiPrices = async (req, res) => {
  try {
    const { state, district, commodity, initialDate, finalDate } = req.query;

    // Ensure that dates are in the format "DD/MM/YYYY"
    const formattedInitialDate = initialDate; // Assumed format is DD/MM/YYYY
    const formattedFinalDate = finalDate; // Assumed format is DD/MM/YYYY

    // Fetch all relevant data based on state, district, and commodity
    const allData = await MandiPrice.find({
      state: state,
      district: district,
      commodity: commodity,
    });

    // Filter data manually based on arrival_date
    const filteredData = allData.filter((item) => {
      const arrivalDate = item.arrival_date;
      return (
        arrivalDate >= formattedInitialDate && arrivalDate <= formattedFinalDate
      );
    });

    if (filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No mandi price data found for the provided filters",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mandi prices retrieved successfully",
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching mandi prices:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching mandi prices",
      error: {
        code: "MANDI_PRICE_FETCH_ERROR",
        description: error.message,
      },
    });
  }
};

const getMandiPriceData = async (req, res) => {
  try {
    // Use aggregation to group data by state, district, and commodity
    const result = await MandiPrice.aggregate([
      {
        // Group by state, district, and commodity
        $group: {
          _id: {
            state: "$state",
            district: "$district",
            commodity: "$commodity",
          },
        },
      },
      {
        // Group by state and district to create the desired structure
        $group: {
          _id: { state: "$_id.state", district: "$_id.district" },
          commodities: { $addToSet: "$_id.commodity" }, // Ensure unique commodities
        },
      },
      {
        // Group by state and push districts into an array
        $group: {
          _id: "$_id.state",
          districts: {
            $push: {
              district: "$_id.district",
              commodities: "$commodities",
            },
          },
        },
      },
      {
        // Format the output to remove _id and match the structure you want
        $project: {
          _id: 0,
          state: "$_id",
          districts: 1,
        },
      },
    ]);

    // Send the structured response
    res.json(result);
  } catch (error) {
    console.error("Error fetching mandi price data:", error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  fetchAndSaveMandiPrices,
  getMandiPrices,
  getMandiPriceData,
};
