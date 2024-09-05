const FpoOrganization = require("../models/appFPOUser");

// Update FPO Organization Profile
exports.updateProfile = async (req, res) => {
  try {
    const { _id } = req.body;
    const updateData = req.body;

    const updatedProfile = await FpoOrganization.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with ID: ${_id}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error updating FPO organization",
      error: {
        code: "FPO_ORGANIZATION_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};
// Get FPO Organization by ID
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const fpoProfile = await FpoOrganization.findById(id);

    if (!fpoProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with ID: ${id}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization retrieved successfully",
      data: fpoProfile,
    });
  } catch (error) {
    console.error("Error retrieving FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving FPO organization",
      error: {
        code: "FPO_ORGANIZATION_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Get FPO Organization by contact number (excluding password)
exports.getProfileByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params; // Get contact number from request parameters

    const fpoProfile = await FpoOrganization.findOne({ contactNumber }).select(
      "-password"
    ); // Exclude the password field

    if (!fpoProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with contact number: ${contactNumber}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization retrieved successfully",
      data: fpoProfile,
    });
  } catch (error) {
    console.error("Error retrieving FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving FPO organization",
      error: {
        code: "FPO_ORGANIZATION_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Update FPO Organization by contact number (excluding contact number and password)
exports.updateProfileByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params; // Get contact number from request parameters
    const updateData = req.body;

    // Prevent updating the contactNumber and password
    delete updateData.contactNumber;
    delete updateData.password;

    const updatedProfile = await FpoOrganization.findOneAndUpdate(
      { contactNumber },
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with contact number: ${contactNumber}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error updating FPO organization",
      error: {
        code: "FPO_ORGANIZATION_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};
