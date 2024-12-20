const express = require("express");
const router = express.Router();
const mandiPriceController = require("../controllers/appFetchMandi");

router.post(
  "/mandi/fetch-and-save",
  mandiPriceController.fetchAndSaveMandiPrices
);
router.get("/mandi/mandi-price-filter", mandiPriceController.getMandiPriceData);
router.get("/mandi/mandiPrices", mandiPriceController.getMandiPrices);
router.get("/mandi/filter", mandiPriceController.getStatesDistrictsCommodities);
router.get("/market/filter", mandiPriceController.getStatesDistricts);
router.get(
  "/mandi/update-mandi-data",
  mandiPriceController.updateStateWithMandiData
);
module.exports = router;
