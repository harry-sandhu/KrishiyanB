// newsController.js

const News = require("../models/appNews");

// Create a new news entry
exports.createNews = async (req, res) => {
  try {
    const { title, description, imageURL, priority } = req.body;
    const news = new News({ title, description, imageURL, priority });
    await news.save();
    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error creating news", error });
  }
};

// Get all news entries
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ priority: -1, createdAt: -1 });
    console.log("Fetched news:", news); // Add this line
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error); // Add this line
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Get a single news entry by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Update a news entry by ID
exports.updateNews = async (req, res) => {
  try {
    const { title, description, imageURL, priority } = req.body;
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, description, imageURL, priority },
      { new: true }
    );
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News updated successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error updating news", error });
  }
};

// Delete a news entry by ID
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error });
  }
};
