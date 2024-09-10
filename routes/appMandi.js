const express = require("express");
const router = express.Router();
const mandiPriceController = require("../controllers/appFetchMandi"); // Adjust the path as needed

// Route to fetch data from API and save it to MongoDB
router.post(
  "/mandi/fetch-and-save",
  mandiPriceController.fetchAndSaveMandiPrices
);
router.get("/mandi/mandi-price-filter", mandiPriceController.getMandiPriceData);
router.get("/mandi/mandiPrices", mandiPriceController.getMandiPrices);
router.get("/mandi/filter", mandiPriceController.getStatesDistrictsCommodities);
router.get(
  "/mandi/update-mandi-data",
  mandiPriceController.updateStateWithMandiData
);
module.exports = router;
