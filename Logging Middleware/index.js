import express from "express";
import dotenv from "dotenv";
dotenv.config();
import Log from "./middleware/logging.js";

const app = express();
app.use(express.json());

// Sample endpoint to demonstrate logging
app.get("/demo-log", async (req, res) => {
	await Log("backend", "info", "route", "Demo endpoint hit successfully");

	res.json({ message: "Log function worked! Check remote logs." });
});

// Intentionally cause an error to trigger error-level logging
app.get("/trigger-error", async (req, res) => {
	try {
		throw new Error("Something failed in the handler");
	} catch (err) {
		await Log("backend", "error", "handler", `Handler error: ${err.message}`);
		res.status(500).json({ error: "Something went wrong" });
	}
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
	Log("backend", "info", "config", "Express server started");
});
