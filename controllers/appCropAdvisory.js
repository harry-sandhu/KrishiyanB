const Crop = require("../models/crop");

const Varities = require("../models/varities");

exports.getVarityByLocalName = async (req, res) => {
  try {
    const { localName } = req.params;

    const crop = await Crop.findOne({ localName });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
        data: null,
      });
    }

    const varities = await Varities.find({ cropId: crop._id });

    if (!varities || varities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No varieties found for this crop",
        data: null,
      });
    }

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

exports.getCropDetailsByName = async (req, res) => {
  const { name } = req.params;

  try {
    const crop = await Crop.findOne({
      localName: new RegExp(`^${name}$`, "i"),
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Crop details retrieved successfully",
      data: crop,
    });
  } catch (error) {
    console.error("Error fetching crop details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
