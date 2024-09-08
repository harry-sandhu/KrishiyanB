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

// Update Entity by contact number
exports.updateByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params; // Get the contact number from params
    const {
      nameOfEntity, // To update nameOfFpo
      typeOfEntity, // To update typeOfFpo
      incorporationDate, // To update dateOfFpo
      incorporationNumber, // To update IncorportionNumber
      businessLocation, // To update BusinessLocation
      contactPersonName, // To update promoterName
      yourDesignation, // To update yourDesignation
      URL, // To update URL
    } = req.body;

    // Find the FPO organization by contact number
    const fpo = await FpoOrganization.findOne({ contactNumber });

    if (!fpo) {
      return res.status(404).send({
        success: false,
        message: "Entity not found",
        error: {
          code: "Entity_NOT_FOUND",
          description: `No Entity found with contact number: ${contactNumber}`,
        },
      });
    }

    // Only update the fields provided in the request body
    if (nameOfEntity) fpo.nameOfFpo = nameOfEntity;
    if (typeOfEntity) fpo.typeOfFpo = typeOfEntity;
    if (incorporationDate) fpo.dateOfFpo = incorporationDate;
    if (incorporationNumber) fpo.IncorportionNumber = incorporationNumber;
    if (businessLocation) fpo.BusinessLocation = businessLocation;
    if (contactPersonName) fpo.promoterName = contactPersonName;
    if (yourDesignation) fpo.yourDesignation = yourDesignation;
    if (URL) fpo.URl = URL;

    // Save the updated FPO organization
    await fpo.save();

    // Return only the updated fields in the response
    const updatedFields = {
      contactNumber,
    };

    if (nameOfEntity) updatedFields.nameOfFpo = nameOfEntity;
    if (typeOfEntity) updatedFields.typeOfFpo = typeOfEntity;
    if (incorporationDate) updatedFields.dateOfFpo = incorporationDate;
    if (incorporationNumber)
      updatedFields.IncorportionNumber = incorporationNumber;
    if (businessLocation) updatedFields.BusinessLocation = businessLocation;
    if (contactPersonName) updatedFields.promoterName = contactPersonName;
    if (yourDesignation) updatedFields.yourDesignation = yourDesignation;
    if (URL) updatedFields.URL = URL;

    res.status(200).send({
      success: true,
      message: "Entity updated successfully",
      data: updatedFields,
    });
  } catch (error) {
    console.error("Error updating Entity:", error);
    res.status(500).send({
      success: false,
      message: "Error updating Entity",
      error: {
        code: "Entity_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};

// Get FPO Organization by contact number
exports.getByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params; // Get contact number from params

    // Find the FPO organization by contact number
    const fpo = await FpoOrganization.findOne({ contactNumber });

    if (!fpo) {
      return res.status(404).send({
        success: false,
        message: "Entity not found",
        error: {
          code: "Entity_NOT_FOUND",
          description: `No entity found with contact number: ${contactNumber}`,
        },
      });
    }

    // Prepare the response with the specific fields, including contact number
    const response = {
      nameOfEntity: fpo.nameOfFpo,
      typeOfEntity: fpo.typeOfFpo,
      incorporationDate: fpo.dateOfFpo,
      incorporationNumber: fpo.IncorportionNumber,
      businessLocation: fpo.BusinessLocation,
      contactPersonName: fpo.promoterName,
      yourDesignation: fpo.yourDesignation,
      URL: fpo.URl,
      contactNumber: fpo.contactNumber, // Include contact number in the response
    };

    res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching Entity:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching Entity",
      error: {
        code: "Entity_FETCH_ERROR",
        description: error.message,
      },
    });
  }
};
