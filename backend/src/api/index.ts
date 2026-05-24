import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import tasksRoute from "../routes/task.route";

// The worker file will execute when imported, creating the worker instance
// Worker initialization errors are handled within the worker file itself
console.log("Loading BullMQ worker...");
import "../workers/scrape.worker";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://web-scraper-ai-nine.vercel.app",
      "https://web-scrapper-ai-blush.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", tasksRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`💡 Try one of these solutions:`);
    console.error(`   1. Set PORT environment variable: PORT=5001 npm run dev`);
    console.error(`   2. Disable AirPlay Receiver in System Settings > General > AirDrop & Handoff`);
    console.error(`   3. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill`);
  } else {
    console.error(`❌ Server failed to start:`, err);
  }
  process.exit(1);
});
