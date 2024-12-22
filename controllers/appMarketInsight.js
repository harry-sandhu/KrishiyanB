const Price = require("../models/appMarketInsight");
const MarketPrice = require("../models/appMarketInsightYearData");

const getPriceByCommodityStateDistrict = async (req, res) => {
  try {
    const { commodity, state, district } = req.query;

    if (!commodity) {
      return res.status(400).json({ message: "Commodity is required" });
    }

    let query = { commodity };

    if (state) {
      query.state = state;
    }

    if (district) {
      query.district = district;
    }

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

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomPriceData = async (req, res) => {
  try {
    const { numItems } = req.body;

    if (!numItems || numItems <= 0) {
      return res.status(400).json({
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

      const todaysPrice = getRandomNumber(100, 500);
      const yesterdaysPrice = getRandomNumber(90, 490);
      const dayBeforeYesterdayPrice = getRandomNumber(80, 480);

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

const populatePriceData = async () => {
  try {
    // Retrieve documents from MarketPrice one at a time
    const marketPriceCursor = MarketPrice.find({}).cursor();

    for (
      let marketPrice = await marketPriceCursor.next();
      marketPrice != null;
      marketPrice = await marketPriceCursor.next()
    ) {
      const { _id, state, district, market, commodity, prices } = marketPrice;

      // Sort prices by date (most recent first)
      const sortedPrices = prices.sort((a, b) => b.date - a.date);

      // Get the last 3 prices if available
      const [todaysPrice, yesterdaysPrice, dayBeforeYesterdaysPrice] = [
        sortedPrices[0]?.price || 0,
        sortedPrices[1]?.price || 0,
        sortedPrices[2]?.price || 0,
      ];

      // Calculate price changes
      const todaysPriceChange = todaysPrice - yesterdaysPrice;
      const yesterdaysPriceChange = yesterdaysPrice - dayBeforeYesterdaysPrice;

      // Create or update the Price document
      const primaryKey = `${state}-${district}-${market}-${commodity}`; // Unique key

      await Price.findOneAndUpdate(
        { primarykey: _id },
        {
          state,
          district,
          market,
          commodity,
          todays_price: todaysPrice,
          yesterdays_price: yesterdaysPrice,
          day_before_yesterday_price: dayBeforeYesterdaysPrice,
          todays_price_change: todaysPriceChange,
          yesterdays_price_change: yesterdaysPriceChange,
          primarykey: _id, // Using _id from MarketPrice as primarykey
        },
        { upsert: true, new: true }
      );

      console.log(
        `Processed MarketPrice document with _id: ${
          (_id, state, district, market, commodity)
        }`
      );
    }

    console.log("All MarketPrice documents processed successfully!");
  } catch (error) {
    console.error("Error processing MarketPrice documents:", error);
  }
};

module.exports = {
  getPriceByCommodityStateDistrict,
  generateRandomPriceData,
  populatePriceData,
};
