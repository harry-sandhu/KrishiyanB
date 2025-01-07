const OtherDetails = require("../models/appOtherDetails");
const { verifyPAN } = require("./appVerifyPan");
const { verifyGST } = require("./appVerifyGST");
const { verifyUdyam } = require("./appVerifyUddam");
const { lookupIFSC } = require("./appVerifyIFSC");

exports.createOrUpdateOtherDetails = async (req, res) => {
  try {
    const {
      uid,
      panCardNumber,
      gstNumber,
      udyamNumber,
      aadhaarNumber,
      ifscCode,
    } = req.body;

    if (!uid) {
      return res.status(400).send({
        success: false,
        message: "UID is required",
        error: {
          code: "UID_REQUIRED",
          description:
            "UID must be provided to create or update other details.",
        },
      });
    }

    try {
      const panVerificationResult = await verifyPAN(panCardNumber);
      if (!panVerificationResult.success) {
        return res.status(400).send({
          success: false,
          message: "PAN verification failed",
          error: {
            code: "PAN_VERIFICATION_FAILED",
            description: panVerificationResult.message,
          },
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "PAN verification failed",
        error: {
          code: "PAN_VERIFICATION_FAILED",
          description: error.message,
        },
      });
    }

    try {
      const gstVerificationResult = await verifyGST(gstNumber);
      if (!gstVerificationResult.success) {
        return res.status(400).send({
          success: false,
          message: "GST verification failed",
          error: {
            code: "GST_VERIFICATION_FAILED",
            description: gstVerificationResult.message,
          },
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "GST verification failed",
        error: {
          code: "GST_VERIFICATION_FAILED",
          description: error.message,
        },
      });
    }

    try {
      const udyamVerificationResult = await verifyUdyam(udyamNumber);
      if (!udyamVerificationResult.success) {
        return res.status(400).send({
          success: false,
          message: "Udyam verification failed",
          error: {
            code: "UDYAM_VERIFICATION_FAILED",
            description: udyamVerificationResult.message,
          },
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "Udyam verification failed",
        error: {
          code: "UDYAM_VERIFICATION_FAILED",
          description: error.message,
        },
      });
    }

    try {
      const ifscDetails = await lookupIFSC(ifscCode);
      if (!ifscDetails) {
        return res.status(400).send({
          success: false,
          message: "IFSC lookup failed",
          error: {
            code: "IFSC_LOOKUP_FAILED",
            description: "Invalid IFSC code or IFSC lookup failed.",
          },
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "IFSC lookup failed",
        error: {
          code: "IFSC_LOOKUP_FAILED",
          description: error.message,
        },
      });
    }

    let otherDetailsEntry = await OtherDetails.findOneAndUpdate(
      { uid },
      { panCardNumber, gstNumber, udyamNumber, aadhaarNumber },
      { new: true, upsert: true }
    );

    const message = otherDetailsEntry.wasNew
      ? "Other details created successfully"
      : "Other details updated successfully";

    res.status(201).send({
      success: true,
      message,
      data: otherDetailsEntry,
    });
  } catch (error) {
    console.error("Error creating or updating other details:", error);
    res.status(400).send({
      success: false,
      message: "Error creating or updating other details",
      error: {
        code: "OTHER_DETAILS_CREATION_OR_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};

// Get Other Details by UID
exports.getOtherDetailsByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).send({
        success: false,
        message: "UID is required",
        error: {
          code: "UID_REQUIRED",
          description: "UID must be provided to retrieve other details.",
        },
      });
    }

    const otherDetails = await OtherDetails.findOne({ uid });

    if (!otherDetails) {
      return res.status(404).send({
        success: false,
        message: "Other details not found",
        error: {
          code: "OTHER_DETAILS_NOT_FOUND",
          description: `No other details found with UID: ${uid}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Other details retrieved successfully",
      data: otherDetails,
    });
  } catch (error) {
    console.error("Error retrieving other details:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving other details",
      error: {
        code: "OTHER_DETAILS_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};
