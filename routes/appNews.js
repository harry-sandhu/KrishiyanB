// newsRoutes.js

const express = require("express");
const router = express.Router();
const newsController = require("../controllers/appNews");

// Create a new news entry
router.post("/news", newsController.createNews);

// Get all news entries
router.get("/all/news", newsController.getAllNews);

// Get a single news entry by ID
router.get("/news/:id", newsController.getNewsById);

// Update a news entry by ID
router.put("/news/:id", newsController.updateNews);

// Delete a news entry by ID
router.delete("/news/:id", newsController.deleteNews);

module.exports = router;
