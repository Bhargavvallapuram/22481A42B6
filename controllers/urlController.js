const generateShortCode = require("../utils/generateShortCode");
const Log = require("../../Logging Middleware/log");

// In-memory array to store URL objects
const urls = [];

exports.createShortUrl = (req, res) => {
  const { originalUrl, expiry } = req.body;

  if (!originalUrl) {
    Log("backend", "error", "controller", "Missing originalUrl in request.");
    return res.status(400).json({ error: "originalUrl is required" });
  }

  try {
    const shortCode = generateShortCode();
    const newUrl = {
      originalUrl,
      shortCode,
      expiry: expiry ? new Date(expiry) : null,
      createdAt: new Date(),
      clicks: [],
    };

    urls.push(newUrl);
    Log("backend", "info", "service", `Shortcode '${shortCode}' created.`);
    res.status(201).json({ shortCode });
  } catch (err) {
    Log("backend", "fatal", "controller", `Unexpected error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectShortUrl = (req, res) => {
  const { shortcode } = req.params;

  try {
    const urlEntry = urls.find((u) => u.shortCode === shortcode);

    if (!urlEntry) {
      Log("backend", "warn", "handler", `Shortcode '${shortcode}' not found.`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (urlEntry.expiry && new Date() > urlEntry.expiry) {
      Log("backend", "info", "handler", `Shortcode '${shortcode}' expired.`);
      return res.status(410).json({ error: "Short URL has expired" });
    }

    urlEntry.clicks.push({
      timestamp: new Date(),
      referrer: req.get("Referrer") || "direct",
      ip: req.ip,
    });

    Log("backend", "info", "controller", `Redirecting '${shortcode}' to original URL.`);
    res.redirect(urlEntry.originalUrl);
  } catch (err) {
    Log("backend", "fatal", "controller", `Redirect error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getShortUrlStats = (req, res) => {
  const { shortcode } = req.params;

  try {
    const urlEntry = urls.find((u) => u.shortCode === shortcode);

    if (!urlEntry) {
      Log("backend", "warn", "controller", `Stats request for unknown shortcode '${shortcode}'`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    Log("backend", "info", "controller", `Retrieved stats for shortcode '${shortcode}'`);
    res.status(200).json({
      originalUrl: urlEntry.originalUrl,
      shortCode: urlEntry.shortCode,
      createdAt: urlEntry.createdAt,
      expiry: urlEntry.expiry,
      totalClicks: urlEntry.clicks.length,
      clicks: urlEntry.clicks,
    });
  } catch (err) {
    Log("backend", "fatal", "controller", `Error fetching stats: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Export the array for access if needed elsewhere (optional)
exports.urls = urls;
