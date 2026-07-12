import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import uploadRouter from "./routes/uploadRoute";


fs.mkdirSync(path.join(__dirname, "..", "uploads"), { recursive: true });

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api", uploadRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Scorevision backend running" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scorevision backend running on port ${PORT}`);
});
