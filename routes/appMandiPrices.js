const express = require("express");
const router = express.Router();
const { getLatestMandiPrices } = require("../controllers/appMandiPrices"); // Adjust the path as needed

// Route to get the latest mandi prices
router.get("/mandi-prices", getLatestMandiPrices);

module.exports = router;
