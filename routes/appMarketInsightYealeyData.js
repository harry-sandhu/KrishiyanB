const express = require("express");
const router = express.Router();
const marketPriceController = require("../controllers/appMarketInsigntYearlyData");

// Add or update market price data
router.post("/add", marketPriceController.addOrUpdateMarketPrice);

router.get("/market-insight", marketPriceController.getMarketPriceByFilters);
router.post(
  "/generate-market-prices",
  marketPriceController.generateMarketPriceData
);
router.get("/:id", marketPriceController.getMarketPriceById);

router.get("/me/market-data/give", marketPriceController.getMarketData);

module.exports = router;
