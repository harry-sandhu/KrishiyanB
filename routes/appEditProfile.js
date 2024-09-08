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
module.exports = router;
