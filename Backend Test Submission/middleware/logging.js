import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Allowed values for validation
const ALLOWED_STACKS = ["backend", "frontend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = [
	// Backend only
	"cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
	// Frontend only
	"api", "component", "hook", "page", "state", "style",
	// Both
	"auth", "config", "middleware", "utils"
];

async function Log(stack, level, pkg, message) {
	// Validate stack, level, and package
	if (!ALLOWED_STACKS.includes(stack)) {
		console.error(`Invalid stack: '${stack}'. Allowed: ${ALLOWED_STACKS.join(", ")}`);
		return;
	}
	if (!ALLOWED_LEVELS.includes(level)) {
		console.error(`Invalid level: '${level}'. Allowed: ${ALLOWED_LEVELS.join(", ")}`);
		return;
	}
	if (!ALLOWED_PACKAGES.includes(pkg)) {
		console.error(`Invalid package: '${pkg}'. Allowed: ${ALLOWED_PACKAGES.join(", ")}`);
		return;
	}
	try {
		const res = await axios.post("http://20.244.56.144/evaluation-service/logs", {
			stack,
			level,
			package: pkg,
			message,
		}, {
			headers: {
				Authorization: `Bearer ${process.env.LOGGING_API_KEY}`,
				"Content-Type": "application/json",
			},
		});
		console.log(JSON.stringify(res.data, null, 2));
	} catch (err) {
		console.error("Failed to send log:", err.response?.data || err.message);
	}
}

export default Log;
