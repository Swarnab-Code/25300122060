import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

import shortUrlRoutes from "./routes/shortUrls.js";
app.use("/", shortUrlRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(process.env.PORT, () => {
			console.log(`Server running at ${process.env.HOST}`);
		});
	})
	.catch((err) => {
		console.error("MongoDB connection failed:", err);
	});
