import { Router } from 'express';
const router = Router();
import Url from "../models/Url.js";
import generateShortCode from "../utils/generateShortCode.js";
import Log from "../middleware/logging.js";

const HOST = process.env.HOST;

// POST: Create Short URL
router.post("/shorturls", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !/^https?:\/\/.+\..+/.test(url)) {
    await Log("backend", "error", "handler", "Invalid URL format");
    return res.status(400).json({ error: "Invalid URL" });
  }

  let finalShortCode = shortcode || generateShortCode();

  try {
    const existing = await Url.findOne({ shortcode: finalShortCode });
    if (existing) {
      await Log("backend", "error", "repository", "Shortcode already in use");
      return res.status(409).json({ error: "Shortcode already exists" });
    }

    const expiry = new Date(Date.now() + validity * 60 * 1000);

    const newUrl = await Url.create({
      originalUrl: url,
      shortcode: finalShortCode,
      expiry,
    });

    await Log("backend", "info", "service", `Short URL created: ${finalShortCode}`);

    res.status(201).json({
      shortLink: `${HOST}/${finalShortCode}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await Log("backend", "fatal", "db", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Redirect Short URL
router.get("/:shortcode", async (req, res) => {
  const { shortcode } = req.params;

  try {
    const record = await Url.findOne({ shortcode });
    if (!record) {
      await Log("backend", "error", "repository", `Shortcode ${shortcode} not found`);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (new Date() > record.expiry) {
      await Log("backend", "warn", "domain", `Shortcode ${shortcode} expired`);
      return res.status(410).json({ error: "Link expired" });
    }

    // Add click info
    record.clicks.push({
      referrer: req.get("Referrer") || "unknown",
      location: "IN", // (static/fake location for demo)
    });

    await record.save();

    await Log("backend", "info", "handler", `Redirected to ${record.originalUrl}`);

    res.redirect(record.originalUrl);
  } catch (err) {
    await Log("backend", "fatal", "db", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Short URL Stats
router.get("/shorturls/:shortcode", async (req, res) => {
  const { shortcode } = req.params;

  try {
    const record = await Url.findOne({ shortcode });
    if (!record) {
      await Log("backend", "error", "repository", "Shortcode stats not found");
      return res.status(404).json({ error: "Shortcode not found" });
    }

    res.json({
      originalUrl: record.originalUrl,
      createdAt: record.createdAt,
      expiry: record.expiry,
      clickCount: record.clicks.length,
      clickDetails: record.clicks,
    });

    await Log("backend", "debug", "service", `Stats returned for ${shortcode}`);
  } catch (err) {
    await Log("backend", "fatal", "db", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
