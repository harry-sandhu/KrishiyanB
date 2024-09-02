const CropData = require("../models/appInsightData");

// Create a new crop data entry
exports.createCropData = async (req, res) => {
  try {
    const { cropName, value } = req.body;
    const newCropData = new CropData({ cropName, value });
    await newCropData.save();
    res.status(201).json(newCropData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all crop data
exports.getAllCropData = async (req, res) => {
  try {
    const cropData = await CropData.find();
    res.status(200).json(cropData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get crop data by name
exports.getCropDataByName = async (req, res) => {
  try {
    const cropData = await CropData.findOne({ cropName: req.params.cropName });
    if (!cropData) {
      return res.status(404).json({ message: "Crop data not found" });
    }
    res.status(200).json(cropData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update crop data value by name
exports.updateCropDataValue = async (req, res) => {
  try {
    const { cropName } = req.params;
    const { value } = req.body;
    const cropData = await CropData.findOneAndUpdate(
      { cropName },
      { value },
      { new: true }
    );
    if (!cropData) {
      return res.status(404).json({ message: "Crop data not found" });
    }
    res.status(200).json(cropData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete crop data by name
exports.deleteCropData = async (req, res) => {
  try {
    const cropData = await CropData.findOneAndDelete({
      cropName: req.params.cropName,
    });
    if (!cropData) {
      return res.status(404).json({ message: "Crop data not found" });
    }
    res.status(200).json({ message: "Crop data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
