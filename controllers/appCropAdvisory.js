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
    // Fetch crop with case-insensitive name
    const crop = await Crop.findOne({
      localName: new RegExp(`^${name}$`, "i"),
    });

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

    // Split the nutrient data into nutrient management and deficiency symptom
    const nutrientManagement = crop.nutrient.filter(
      (item) => !item.deficiency?.Notable_Symptoms
    );
    const deficiencySymptom = crop.nutrient.filter(
      (item) => item.deficiency?.Notable_Symptoms
    );

    // Construct the response object
    const responseData = {
      localName: crop.localName,
      scientificName: crop.scientificName,
      description: crop.description,
      createdAt: crop.createdAt,
      updatedAt: crop.updatedAt,
      stages: crop.stages,
      generalInformation: crop.generalInformation,
      presowingPractices: crop.presowingPractices,
      nutrientManagement: nutrientManagement, // Items without deficiency
      pestManagement: crop.pestManagement,
      diseaseManagement: crop.diseaseManagement,
      deficiencySymptom: deficiencySymptom, // Items with deficiency
      weedManagement: crop.weedManagement,
      weatherInjuries: crop.weatherInjuries,
      irrigation: crop.newHarvest,
      faq: crop.faq,
    };

    res.status(200).send({
      success: true,
      message: "Crop found successfully",
      data: responseData,
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
