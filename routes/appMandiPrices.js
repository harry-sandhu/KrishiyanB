const express = require("express");
const router = express.Router();
const { getLatestMandiPrices } = require("../controllers/appMandiPrices");

router.get("/mandi-prices", getLatestMandiPrices);

module.exports = router;
