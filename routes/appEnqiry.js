const express = require("express");
const router = express.Router();
const commodityController = require("../controllers/appEnquiry");

// Route for creating or updating commodity details
router.post("/commodity", commodityController.createOrUpdateCommodity);

// Route for fetching commodity details by UID
router.get("/commodity/:uid", commodityController.getCommodityByUid);

// Route for fetching all commodities
router.get("/commodities", commodityController.getAllCommodities);

// Route to update a single commodity by UID and _id
router.put(
  "/commodities/:uid/:id",
  commodityController.updateCommodityByUidAndId
);

router.get(
  "/commodities/:commodity",
  commodityController.getCommoditiesByValue
);

// Define a route to get commodities by uid, commodity, and optional operation
router.get(
  "/commodities/:uid/:commodity",
  commodityController.getCommoditiesByUidOperationCommodity
);

// Route for updating the verified status of a commodity
router.patch(
  "/commodity/:uid/verified",
  commodityController.updateVerifiedStatus
);
module.exports = router;
