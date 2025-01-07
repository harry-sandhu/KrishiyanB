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

    let commodity = await Commodity.findOneAndUpdate(
      { uid },
      { verified },
      { new: true }
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

    const updatedCommodity = await Commodity.findOneAndUpdate(
      { uid, _id: id },
      updateData,
      { new: true }
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
    const { commodity } = req.params;

    const commodities = await Commodity.find({ commodity });

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

    res.status(200).send({
      success: true,
      message: `Commodities for ${commodity} retrieved successfully`,
      data: commodities,
    });
  } catch (error) {
    console.error("Error retrieving commodities:", error);

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
    const { uid, commodity } = req.params;
    let { operation } = req.query;

    if (!operation) {
      operation = "Buy";
    }

    const query = { uid, commodity, operation };

    const commodities = await Commodity.find(query);

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

    res.status(200).send({
      success: true,
      message: `Enquiry retrieved successfully for uid: ${uid}, commodity: ${commodity}, and operation: ${operation}`,
      data: commodities,
    });
  } catch (error) {
    console.error("Error retrieving commodities:", error);

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
