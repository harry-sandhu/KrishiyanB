const express = require("express");
const router = express.Router();
const { makeAdmin } = require("./AdminController");

// Route to make a dealer an admin
router.post("/make-admin", makeAdmin);

module.exports = router;
