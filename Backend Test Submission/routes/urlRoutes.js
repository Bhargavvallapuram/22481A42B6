const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

router.post("/", urlController.createShortUrl);
router.get("/:shortcode", urlController.redirectShortUrl);
router.get("/:shortcode/stats", urlController.getShortUrlStats);

module.exports = router;