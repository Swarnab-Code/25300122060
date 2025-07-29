import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
	timestamp: { type: Date, default: Date.now },
	referrer: String,
	location: String, // Placeholder for location data
});

const urlSchema = new mongoose.Schema({
	originalUrl: { type: String, required: true },
	shortcode: { type: String, required: true, unique: true },
	createdAt: { type: Date, default: Date.now },
	expiry: { type: Date },
	clicks: [clickSchema],
});

export default mongoose.model("Url", urlSchema);
