const Crop = require("../models/crop");

// Get all crop names
exports.getAllCropNames = async (req, res) => {
  try {
    const crops = await Crop.find().select("localName"); // Fetch all local names only
    const cropNames = crops.map((crop) => crop.localName);

    res.status(200).send({
      success: true,
      message: "Crop names retrieved successfully",
      data: cropNames,
    });
  } catch (error) {
    console.error("Error retrieving crop names:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving crop names",
      error: {
        code: "CROP_NAMES_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Get detailed information based on crop name
exports.getCropDetailsByName = async (req, res) => {
  const { name } = req.params;
  console.log("Searching for crop with name:", name);

  try {
    const crop = await Crop.findOne({
      localName: new RegExp(`^${name}$`, "i"),
    });
    console.log("Found crop:", crop);

    if (!crop) {
      return res.status(404).send({
        success: false,
        message: "Crop not found",
        error: {
          code: "CROP_NOT_FOUND",
          description: `No crop found with the name: ${name}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Crop found successfully",
      data: crop,
    });
  } catch (error) {
    console.error("Error fetching crop details:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching crop details",
      error: {
        code: "CROP_FETCH_ERROR",
        description: error.message,
      },
    });
  }
};
