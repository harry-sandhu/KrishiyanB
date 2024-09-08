const express = require("express");
const router = express.Router();
const mandiPriceController = require("../controllers/appFetchMandi"); // Adjust the path as needed

// Route to fetch data from API and save it to MongoDB
router.post(
  "/mandi/fetch-and-save",
  mandiPriceController.fetchAndSaveMandiPrices
);

module.exports = router;
