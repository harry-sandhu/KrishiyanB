const express = require("express");
const router = express.Router();
const marketPriceController = require("../controllers/appMarketInsigntYearlyData");

// Add or update market price data
router.post("/add", marketPriceController.addOrUpdateMarketPrice);

// Retrieve data by filters
router.get("/market-insight", marketPriceController.getMarketPriceByFilters);
router.post(
  "/generate-market-prices",
  marketPriceController.generateMarketPriceData
);

module.exports = router;
