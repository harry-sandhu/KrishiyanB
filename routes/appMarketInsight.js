const express = require("express");
const router = express.Router();
const {
  getPriceByCommodityStateDistrict,
  generateRandomPriceData,
} = require("../controllers/appMarketInsight");

// Route to get price details based on commodity, state, and district
router.get("/price", getPriceByCommodityStateDistrict);
router.post("/generate-random-prices", generateRandomPriceData);

module.exports = router;
