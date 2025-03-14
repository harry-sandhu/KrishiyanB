const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/appFarmerController");

// Route to register crop cultivation data
router.post("/crop/register", farmerController.registerCropCultivation);

// Route to get all crop cultivation data
router.get("/crop", farmerController.getCropCultivations);
// PUT request to update a crop cultivation by _id
router.put("/crops/:_id", farmerController.updateCropCultivation);
// Route to get crop cultivation data by Fid
router.get("/:fid", farmerController.getCropCultivationByFid);
// Route for farmer registration
router.post("/register", farmerController.registerFarmer);

// Route to get all farmers
router.get("/all/farmer", farmerController.getFarmers);

// Route to get farmers' names by dealer number
router.get("/names/:dealerNumber", farmerController.getFarmerNamesByDealer);

// Route to get all farmer data by dealer number
router.get("/data/:dealerNumber", farmerController.getFarmerDataByDealer);

// Route to get all unique village names by dealer number
router.get("/villages/:dealerNumber", farmerController.getVillagesByDealer);

router.get("/crops/:dealerNumber", farmerController.getCropsByDealerNumber);
// Route to get farmers based on dealer number, village, and crop
router.get("/farmers/insight", farmerController.getFarmersByCriteria);

// Route to get farmers based on type of cultivation practice and dealer number
router.get(
  "/farmers/cultivation/:typeOfCultivationPractice/dealer/:dealerNumber",
  farmerController.getFarmersByCultivationAndDealer
);

// Route to get farmer data by dealer number and village name
router.get(
  "/data/:dealerNumber/:village",
  farmerController.getFarmerDataByDealerAndVillage
);

// Route to search farmers by dealer number and WhatsApp number
router.get("/farmer/search", farmerController.searchFarmersByDealerAndWhatsApp);

router.put(
  "/farmer/whatsapp/:whatsappNumber",
  farmerController.updateFarmerByWhatsapp
);

router.post("/farmer/bulk-upload", farmerController.bulkUploadFarmers);
module.exports = router;
