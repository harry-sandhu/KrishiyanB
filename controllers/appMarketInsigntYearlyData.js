const MarketPrice = require("../models/appMarketInsightYearData");
const State = require("../models/appMandiFilter");
// Add or update market price data
const addOrUpdateMarketPrice = async (req, res) => {
  const { state, district, market, commodity, price, date } = req.body;

  try {
    const formattedDate = new Date(date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 366); // Calculate the cutoff date (366 days ago)

    // Find the record for the given state, district, market, and commodity
    let record = await MarketPrice.findOne({
      state,
      district,
      market,
      commodity,
    });

    if (!record) {
      // If no record exists, create a new one
      record = new MarketPrice({
        state,
        district,
        market,
        commodity,
        prices: [],
      });
    }

    // Add the new price entry
    record.prices.push({ price, date: formattedDate });

    // Remove prices older than the cutoff date
    record.prices = record.prices.filter((entry) => entry.date >= cutoffDate);

    // Save the record
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
    const records = await MarketPrice.find({
      state,
      district,
      commodity,
    });

    if (!records.length) {
      return res
        .status(404)
        .json({ message: "No data found for the specified filters." });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving market price data." });
  }
};

// Adjust the path to your State model
// Adjust the path to your MarketPrice model

// Utility to generate a random price
const generateRandomPrice = () => Math.floor(Math.random() * 10000) + 145;

// Utility to generate price data for 366 days
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
    const states = await State.find(); // Fetch all states with districts and commodities

    for (const state of states) {
      for (const district of state.districts) {
        for (const commodity of district.commodities) {
          // Generate 366 price data
          const priceData = generatePriceData();

          // Create a MarketPrice document
          const marketPriceEntry = new MarketPrice({
            state: state.stateName,
            district: district.name,
            market: `${district.name} Market`, // Placeholder for market name
            commodity: commodity,
            prices: priceData,
          });

          // Save the entry to the database
          await marketPriceEntry.save();
          console.log(marketPriceEntry);
          console.log(
            `Generated and saved market price data for ${commodity} in ${district.name}, ${state.stateName}`
          );
        }
      }
    }

    res.status(201).json({
      message: "Market price data generated and saved successfully!",
    });
  } catch (error) {
    console.error("Error generating market price data:", error);
    res.status(500).json({
      message: "An error occurred while generating market price data.",
      error: error.message,
    });
  }
};

module.exports = {
  generateMarketPriceData,
  getMarketPriceByFilters,
  addOrUpdateMarketPrice,
};
