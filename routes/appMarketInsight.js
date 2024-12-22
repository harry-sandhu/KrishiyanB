const express = require("express");
const router = express.Router();
const {
  getPriceByCommodityStateDistrict,
  generateRandomPriceData,
} = require("../controllers/appMarketInsight");

router.get("/price", getPriceByCommodityStateDistrict);
router.post("/generate-random-prices", generateRandomPriceData);

module.exports = router;
