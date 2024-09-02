const express = require("express");
const router = express.Router();
const { verifyPAN } = require("../controllers/appVerifyPan");
const { verifyGST } = require("../controllers/appVerifyGST");
const { verifyUdyam } = require("../controllers/appVerifyUddam");
const { lookupIFSC } = require("../controllers/appVerifyIFSC");

// Route for PAN verification
router.post("/verify-pan", verifyPAN);

// Route for GST verification
router.post("/verify-gst", async (req, res) => {
  const { gstNumber } = req.body;
  try {
    const result = await verifyGST(gstNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Route for Udyam verification
router.post("/verify-udyam", async (req, res) => {
  const { udyamNumber } = req.body;
  try {
    const result = await verifyUdyam(udyamNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Route for IFSC lookup
router.get("/lookup-ifsc/:ifscCode", async (req, res) => {
  const { ifscCode } = req.params;
  try {
    const result = await lookupIFSC(ifscCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
