const express = require("express");
const router = express.Router();
const fpoOrganizationController = require("../controllers/appEditProfile");

// Route for updating FPO organization profile
router.put("/fpoOrganization", fpoOrganizationController.updateProfile);
router.get("/fpoOrganization/:id", fpoOrganizationController.getProfileById);
router.put(
  "/fpoOrganization/contact/:contactNumber",
  fpoOrganizationController.updateProfileByContactNumber
);
router.put(
  "/entity/contact/:contactNumber",
  fpoOrganizationController.updateByContactNumber
);

router.get(
  "/entity/contact/:contactNumber",
  fpoOrganizationController.getByContactNumber
);
router.get(
  "/fpoOrganization/contact/:contactNumber",
  fpoOrganizationController.getProfileByContactNumber
);

// Route to get FPO data based on type of organization
router.get(
  "/organization/:typeOfOrganization",
  fpoOrganizationController.getFpoByTypeOfOrganization
);

// Route to get FPO data based on type of FPO
router.get("/fpo-type/:typeOfFpo", fpoOrganizationController.getFpoByTypeOfFpo);
module.exports = router;
