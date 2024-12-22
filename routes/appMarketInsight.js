const express = require("express");
const router = express.Router();
const {
  getPriceByCommodityStateDistrict,
  generateRandomPriceData,
  populatePriceData,
} = require("../controllers/appMarketInsight");

router.get("/price", getPriceByCommodityStateDistrict);
router.post("/generate-random-prices", generateRandomPriceData);
router.post("/populate-price-data", populatePriceData);

module.exports = router;
