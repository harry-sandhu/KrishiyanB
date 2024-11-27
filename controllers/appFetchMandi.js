const axios = require("axios");
const MandiPrice = require("../models/mandiPrices"); // Adjust the path as needed
const State = require("../models/appMandiFilter");
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

    // Convert initialDate and finalDate to YYYY-MM-DD format
    const formattedInitialDate = initialDate.split("/").reverse().join("-"); // DD/MM/YYYY -> YYYY-MM-DD
    const formattedFinalDate = finalDate.split("/").reverse().join("-"); // DD/MM/YYYY -> YYYY-MM-DD

    // Fetch all relevant data from the database
    const allData = await MandiPrice.find({
      state: state,
      district: district,
      commodity: commodity,
    });

    // Filter manually by converting each arrival_date to YYYY-MM-DD
    const filteredData = allData.filter((item) => {
      const arrivalDate = item.arrival_date.split("/").reverse().join("-"); // Convert to YYYY-MM-DD
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
    const result = await MandiPrice.aggregate([
      {
        $group: {
          _id: {
            state: "$state",
            district: "$district",
            commodity: "$commodity",
          },
        },
      },
      {
        $group: {
          _id: { state: "$_id.state", district: "$_id.district" },
          commodities: { $addToSet: "$_id.commodity" },
        },
      },
      {
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
        $project: {
          _id: 0,
          state: "$_id",
          districts: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Mandi price data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching mandi price data:", error);
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

const getStatesDistrictsCommodities = async (req, res) => {
  const { stateName, districtName } = req.query;

  try {
    // If no stateName is provided, return the list of states
    if (!stateName) {
      const states = await State.find({}, "stateName");
      return res.status(200).json({
        success: true,
        message: "States fetched successfully",
        data: states.map((state) => state.stateName),
      });
    }

    // If only stateName is provided, return the list of districts for the state
    if (stateName && !districtName) {
      const state = await State.findOne({ stateName }, "districts.name");
      if (!state) {
        return res.status(404).json({
          success: false,
          message: `State '${stateName}' not found`,
          error: {
            code: "STATE_NOT_FOUND",
            description: `No data available for the state '${stateName}'`,
          },
        });
      }
      return res.status(200).json({
        success: true,
        message: `Districts for state '${stateName}' fetched successfully`,
        data: state.districts.map((district) => district.name),
      });
    }

    // If both stateName and districtName are provided, return commodities for that state and district
    if (stateName && districtName) {
      const state = await State.findOne({ stateName }, "districts");
      if (!state) {
        return res.status(404).json({
          success: false,
          message: `State '${stateName}' not found`,
          error: {
            code: "STATE_NOT_FOUND",
            description: `No data available for the state '${stateName}'`,
          },
        });
      }

      const district = state.districts.find((d) => d.name === districtName);
      if (!district) {
        return res.status(404).json({
          success: false,
          message: `District '${districtName}' not found in state '${stateName}'`,
          error: {
            code: "DISTRICT_NOT_FOUND",
            description: `No data available for the district '${districtName}' in state '${stateName}'`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: `Commodities for district '${districtName}' in state '${stateName}' fetched successfully`,
        data: district.commodities,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching state, district, or commodity data",
      error: {
        code: "STATE_DISTRICT_COMMODITY_FETCH_ERROR",
        description: error.message,
      },
    });
  }
};

const updateStateWithMandiData = async (req, res) => {
  try {
    const uniqueStates = await MandiPrice.distinct("state");

    for (const stateName of uniqueStates) {
      const uniqueDistricts = await MandiPrice.distinct("district", {
        state: stateName,
      });

      const districtsData = [];
      console.log("uniqueDistricts", uniqueDistricts);
      for (const districtName of uniqueDistricts) {
        const uniqueCommodities = await MandiPrice.distinct("commodity", {
          state: stateName,
          district: districtName,
        });

        districtsData.push({
          name: districtName,
          commodities: uniqueCommodities,
        });
      }

      await State.updateOne(
        { stateName },
        {
          stateName,
          districts: districtsData,
        },
        { upsert: true }
      );
    }

    res
      .status(200)
      .json({ message: "State data updated successfully from MandiPrice" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  fetchAndSaveMandiPrices,
  getMandiPrices,
  getMandiPriceData,
  getStatesDistrictsCommodities,
  updateStateWithMandiData,
};
