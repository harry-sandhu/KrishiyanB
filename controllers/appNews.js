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
    // Fetching all news sorted by priority in ascending order (low to high)
    const news = await News.find().sort({ priority: 1 });

    // Sending the sorted news as a response with the specified format
    res.status(200).send({
      success: true,
      message: "News retrieved successfully",
      data: news,
    });
  } catch (error) {
    // Handling errors and sending an error response with the specified format
    res.status(500).send({
      success: false,
      message: "Failed to retrieve news",
      error: error.message,
    });
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
