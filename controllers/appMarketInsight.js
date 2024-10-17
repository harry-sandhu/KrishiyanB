const Price = require("../models/appMarketInsight");

// Get price information based on commodity, state, and district
const getPriceByCommodityStateDistrict = async (req, res) => {
  try {
    const { commodity, state, district } = req.query;

    // Ensure commodity is provided
    if (!commodity) {
      return res.status(400).json({ message: "Commodity is required" });
    }

    // Build query object
    let query = { commodity };

    if (state) {
      query.state = state;
    }

    if (district) {
      query.district = district;
    }

    // Fetch the price details from the database
    const priceData = await Price.find(query);

    if (priceData.length === 0) {
      return res.status(404).json({ message: "No price data found" });
    }

    res.status(200).json(priceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const states = [
  "Punjab",
  "Haryana",
  "Maharashtra",
  "Uttar Pradesh",
  "Rajasthan",
];
const districts = ["Amritsar", "Ludhiana", "Nagpur", "Kanpur", "Jaipur"];
const markets = ["Market 1", "Market 2", "Market 3", "Market 4", "Market 5"];
const commodities = ["Wheat", "Rice", "Sugarcane", "Cotton", "Barley"];

// Helper function to generate random number within a range
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Controller to generate random price data
const generateRandomPriceData = async (req, res) => {
  try {
    const { numItems } = req.body;

    if (!numItems || numItems <= 0) {
      return res
        .status(400)
        .json({
          message: "Please provide a valid number of items to generate",
        });
    }

    const randomPriceData = [];

    for (let i = 0; i < numItems; i++) {
      const randomState = states[getRandomNumber(0, states.length - 1)];
      const randomDistrict =
        districts[getRandomNumber(0, districts.length - 1)];
      const randomMarket = markets[getRandomNumber(0, markets.length - 1)];
      const randomCommodity =
        commodities[getRandomNumber(0, commodities.length - 1)];

      const todaysPrice = getRandomNumber(100, 500); // Random price between 100 and 500
      const yesterdaysPrice = getRandomNumber(90, 490); // Random price between 90 and 490
      const dayBeforeYesterdayPrice = getRandomNumber(80, 480); // Random price between 80 and 480

      // Create a new Price document
      const newPrice = new Price({
        state: randomState,
        district: randomDistrict,
        market: randomMarket,
        commodity: randomCommodity,
        todays_price: todaysPrice,
        yesterdays_price: yesterdaysPrice,
        day_before_yesterday_price: dayBeforeYesterdayPrice,
      });

      randomPriceData.push(newPrice);
    }

    // Save all generated price data to the database
    const savedData = await Price.insertMany(randomPriceData);

    res.status(201).json({
      message: `${numItems} random price entries created successfully`,
      data: savedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating random price data" });
  }
};

module.exports = { getPriceByCommodityStateDistrict, generateRandomPriceData };
