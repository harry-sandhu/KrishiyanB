const Commodity = require("../models/appEnquiry");

// Create or Update Commodity
exports.createOrUpdateCommodity = async (req, res) => {
  try {
    const {
      uid,
      operation,
      commodity,
      variety,
      quantity,
      moisture,
      localGradeSpecification,
      size,
      count,
      price,
      date,
      origin,
      location,
      photoVideoLink,
      comments,
      verified,
    } = req.body;

    // Check if UID is provided
    if (!uid) {
      return res.status(400).send({
        success: false,
        message: "UID is required",
        error: {
          code: "UID_REQUIRED",
          description:
            "UID must be provided to create or update commodity details.",
        },
      });
    }

    // Create a new commodity entry
    let newCommodity = new Commodity({
      uid,
      operation,
      commodity,
      variety,
      quantity,
      moisture,
      localGradeSpecification,
      size,
      count,
      price,
      date,
      origin,
      location,
      photoVideoLink,
      comments,
      verified,
    });

    await newCommodity.save();

    res.status(201).send({
      success: true,
      message: "Commodity created successfully",
      data: newCommodity,
    });
  } catch (error) {
    console.error("Error creating commodity:", error);
    res.status(400).send({
      success: false,
      message: "Error creating commodity",
      error: {
        code: "COMMODITY_CREATION_ERROR",
        description: error.message,
      },
    });
  }
};

exports.getCommodityByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).send({
        success: false,
        message: "UID is required",
        error: {
          code: "UID_REQUIRED",
          description: "UID must be provided to retrieve commodity details.",
        },
      });
    }

    // Find all commodities with the given UID and sort them by the 'verified' field
    let commodities = await Commodity.find({ uid }).sort({ verified: -1 });

    if (commodities.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No commodities found",
        error: {
          code: "COMMODITIES_NOT_FOUND",
          description: `No commodities found with UID: ${uid}`,
        },
      });
    }

    // Mask 10-digit numbers in the 'comments' field
    commodities = commodities.map((commodity) => {
      commodity = JSON.parse(JSON.stringify(commodity));
      if (commodity.comments && typeof commodity.comments === "string") {
        commodity.comments = commodity.comments.replace(
          /\b\d{10}\b/g,
          "xxxxxxxxxx"
        );
      }
      return commodity;
    });

    res.status(200).send({
      success: true,
      message: "Commodities retrieved successfully",
      data: commodities,
    });
  } catch (error) {
    console.error("Error retrieving commodities:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving commodities",
      error: {
        code: "COMMODITIES_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

exports.getAllCommodities = async (req, res) => {
  try {
    let commodities = await Commodity.find().sort({ verified: -1 });

    // Mask 10-digit numbers in the 'comments' field
    commodities = commodities.map((commodity) => {
      commodity = JSON.parse(JSON.stringify(commodity));
      if (commodity.comments && typeof commodity.comments === "string") {
        commodity.comments = commodity.comments.replace(
          /\b\d{10}\b/g,
          "xxxxxxxxxx"
        );
      }
      return commodity;
    });

    res.status(200).send({
      success: true,
      message: "All commodities retrieved successfully",
      data: commodities,
    });
  } catch (error) {
    console.error("Error retrieving commodities:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving commodities",
      error: {
        code: "COMMODITIES_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Update Verified Status of a Commodity
exports.updateVerifiedStatus = async (req, res) => {
  try {
    const { uid } = req.params;
    const { verified } = req.body;

    // Check if uid is provided
    if (!uid) {
      return res.status(400).send({
        success: false,
        message: "UID is required",
        error: {
          code: "UID_REQUIRED",
          description: "UID must be provided to update the verified status.",
        },
      });
    }

    // Find the commodity by uid and update the verified status
    let commodity = await Commodity.findOneAndUpdate(
      { uid },
      { verified },
      { new: true } // Return the updated document
    );

    if (!commodity) {
      return res.status(404).send({
        success: false,
        message: "Commodity not found",
        error: {
          code: "COMMODITY_NOT_FOUND",
          description: `No commodity found with UID: ${uid}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Verified status updated successfully",
      data: commodity,
    });
  } catch (error) {
    console.error("Error updating verified status:", error);
    res.status(400).send({
      success: false,
      message: "Error updating verified status",
      error: {
        code: "VERIFIED_STATUS_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};

// Update a single commodity by UID and _id
exports.updateCommodityByUidAndId = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const updateData = req.body;

    // Check if UID and ID are provided
    if (!uid || !id) {
      return res.status(400).send({
        success: false,
        message: "UID and ID are required",
        error: {
          code: "UID_ID_REQUIRED",
          description:
            "Both UID and ID must be provided to update a commodity.",
        },
      });
    }

    // Find the commodity by UID and _id and update it
    const updatedCommodity = await Commodity.findOneAndUpdate(
      { uid, _id: id },
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedCommodity) {
      return res.status(404).send({
        success: false,
        message: "Commodity not found",
        error: {
          code: "COMMODITY_NOT_FOUND",
          description: `No commodity found with UID: ${uid} and ID: ${id}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Commodity updated successfully",
      data: updatedCommodity,
    });
  } catch (error) {
    console.error("Error updating commodity:", error);
    res.status(400).send({
      success: false,
      message: "Error updating commodity",
      error: {
        code: "COMMODITY_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};

// Controller to fetch commodities based on the commodity value
exports.getCommoditiesByValue = async (req, res) => {
  try {
    // Extract the commodity value from request parameters
    const { commodity } = req.params;

    // Find all records matching the provided commodity value
    const commodities = await Commodity.find({ commodity });

    // If no commodities found, return a 404 error
    if (!commodities.length) {
      return res.status(404).send({
        success: false,
        message: `No commodities found for the given value: ${commodity}`,
        error: {
          code: "COMMODITY_NOT_FOUND",
          description: `No commodities match the specified value: ${commodity}.`,
        },
      });
    }

    // Return all the data related to the found commodities
    res.status(200).send({
      success: true,
      message: `Commodities for ${commodity} retrieved successfully`,
      data: commodities, // Send all commodity details
    });
  } catch (error) {
    console.error("Error retrieving commodities:", error);

    // Handle server error
    res.status(500).send({
      success: false,
      message: "Error retrieving commodities",
      error: {
        code: "COMMODITY_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Controller to fetch commodities based on uid, commodity, and optional operation
exports.getCommoditiesByUidOperationCommodity = async (req, res) => {
  try {
    // Extract uid, commodity, and operation from request parameters
    const { uid, commodity } = req.params;
    let { operation } = req.query; // operation can be provided in query params

    // If no operation is specified, default to "Buy"
    if (!operation) {
      operation = "Buy";
    }

    // Construct the query based on uid, commodity, and operation
    const query = { uid, commodity, operation };

    // Find commodities matching the provided uid, commodity, and operation (or default)
    const commodities = await Commodity.find(query);

    // If no commodities are found, return a 404 error
    if (!commodities.length) {
      return res.status(404).send({
        success: false,
        message: `No Enquiry found for uid: ${uid}, commodity: ${commodity}, and operation: ${operation}`,
        error: {
          code: "Enquiry_NOT_FOUND",
          description: `No Enquiry match the specified criteria.`,
        },
      });
    }

    // Return all the data related to the found commodities
    res.status(200).send({
      success: true,
      message: `Enquiry retrieved successfully for uid: ${uid}, commodity: ${commodity}, and operation: ${operation}`,
      data: commodities, // Send all commodity details
    });
  } catch (error) {
    console.error("Error retrieving commodities:", error);

    // Handle server error
    res.status(500).send({
      success: false,
      message: "Error retrieving commodities",
      error: {
        code: "Enquiry_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Delete an enquiry by uid
exports.deleteEnquiryByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const deletedEnquiry = await Commodity.findOneAndDelete({ uid });

    if (!deletedEnquiry) {
      return res.status(404).send({
        success: false,
        message: "Enquiry not found",
        error: {
          code: "ENQUIRY_NOT_FOUND",
          description: `No enquiry found with uid: ${uid}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting enquiry",
      error: {
        code: "ENQUIRY_DELETION_ERROR",
        description: error.message,
      },
    });
  }
};
