const MarketPrice = require("../models/appMarketInsightYearData");
const State = require("../models/appMandiFilter");
// Add or update market price data
const addOrUpdateMarketPrice = async (req, res) => {
  const { state, district, market, commodity, price, date } = req.body;

  try {
    const formattedDate = new Date(date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 366);

    let record = await MarketPrice.findOne({
      state,
      district,
      market,
      commodity,
    });

    if (!record) {
      record = new MarketPrice({
        state,
        district,
        market,
        commodity,
        prices: [],
      });
    }

    record.prices.push({ price, date: formattedDate });

    record.prices = record.prices.filter((entry) => entry.date >= cutoffDate);

    await record.save();

    res.status(200).json({
      message: "Market price data added/updated successfully.",
      record,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while adding/updating market price data.",
    });
  }
};

const getMarketPriceByFilters = async (req, res) => {
  const { state, district, commodity } = req.query;

  try {
    if (!state || !district || !commodity) {
      return res.status(400).send({
        success: false,
        message: "Missing required query parameters.",
        error: {
          code: "MISSING_PARAMETERS",
          description: "State, district, and commodity must be provided.",
        },
      });
    }

    const records = await MarketPrice.find({
      state,
      district,
      commodity,
    });

    if (!records.length) {
      return res.status(404).send({
        success: false,
        message: "No data found for the specified filters.",
        error: {
          code: "NO_DATA_FOUND",
          description:
            "No records match the given state, district, and commodity.",
        },
      });
    }

    return res.status(200).send({
      success: true,
      message: "Data retrieved successfully.",
      data: records,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while retrieving market price data.",
      error: {
        code: "SERVER_ERROR",
        description: error.message,
      },
    });
  }
};

const generateRandomPrice = () => Math.floor(Math.random() * 10000) + 145;

const generatePriceData = () => {
  const today = new Date();
  return Array.from({ length: 366 }, (_, i) => ({
    price: generateRandomPrice(),
    date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000),
  }));
};

// Controller to generate and store market price data
const generateMarketPriceData = async (req, res) => {
  try {
    const states = await State.find();
    const allCombinations = [];

    // Collect all state-district-commodity combinations
    for (const state of states) {
      for (const district of state.districts) {
        for (const commodity of district.commodities) {
          allCombinations.push({
            state: state.stateName,
            district: district.name,
            commodity,
          });
        }
      }
    }

    // Shuffle and select 5 random combinations
    const selectedCombinations = allCombinations
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    // Generate and save data for the selected combinations
    for (const combination of selectedCombinations) {
      const priceData = generatePriceData();

      const marketPriceEntry = new MarketPrice({
        state: combination.state,
        district: combination.district,
        market: `${combination.district} Market`,
        commodity: combination.commodity,
        prices: priceData,
      });

      await marketPriceEntry.save();
      console.log(
        `Generated and saved market price data for ${combination.commodity} in ${combination.district}, ${combination.state}`
      );
    }

    res.status(201).json({
      message:
        "Market price data generated and saved for 5 combinations successfully!",
    });
  } catch (error) {
    console.error("Error generating market price data:", error);
    res.status(500).json({
      message: "An error occurred while generating market price data.",
      error: error.message,
    });
  }
};

const getMarketPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "ID is required.",
        error: {
          code: "ID_REQUIRED",
          description:
            "The _id must be provided to retrieve the market price document.",
        },
      });
    }

    const record = await MarketPrice.findById(id);

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "No document found for the provided ID.",
        error: {
          code: "DOCUMENT_NOT_FOUND",
          description: "No record matches the given _id.",
        },
      });
    }

    return res.status(200).send({
      success: true,
      message: "Document retrieved successfully.",
      data: record,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while retrieving the document.",
      error: {
        code: "SERVER_ERROR",
        description: error.message,
      },
    });
  }
};

const getMarketData = async (req, res) => {
  try {
    const marketData = await MarketPrice.find({}, "state district commodity");

    if (marketData.length === 0) {
      return res.status(404).json({ message: "No market data found." });
    }

    res.status(200).json({
      message: "Market data retrieved successfully.",
      data: marketData,
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  generateMarketPriceData,
  getMarketPriceByFilters,
  addOrUpdateMarketPrice,
  getMarketPriceById,
  getMarketData,
};
