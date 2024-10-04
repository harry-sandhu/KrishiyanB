const Crop = require("../models/crop");

const Varities = require("../models/varities");

exports.getVarityByLocalName = async (req, res) => {
  try {
    const { localName } = req.params;

    // Step 1: Search for the crop by localName
    const crop = await Crop.findOne({ localName });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
        data: null,
      });
    }

    // Step 2: Use the crop _id to search for varieties in Varities collection
    const varities = await Varities.find({ cropId: crop._id });

    if (!varities || varities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No varieties found for this crop",
        data: null,
      });
    }

    // Step 3: Return the found varieties in the desired response format
    return res.status(200).json({
      success: true,
      message: "Varieties retrieved successfully",
      data: varities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};

exports.getAllCropNames = async (req, res) => {
  try {
    const crops = await Crop.find().select("localName");
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
