import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import uploadRouter from "./routes/uploadRoute";


fs.mkdirSync(path.join(__dirname, "..", "uploads"), { recursive: true });

const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  FRONTEND_URL,
  "https://scorevision-delta.vercel.app",
  /^https:\/\/scorevision-.*\.vercel\.app$/,
];

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    callback(allowed ? null : new Error("Not allowed by CORS"), allowed);
  },
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api", uploadRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Scorevision backend running" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scorevision backend running on port ${PORT}`);
});
