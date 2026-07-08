import express from "express";
import cors from "cors";
import path from "path";
import uploadRouter from "./routes/uploadRoute";

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

app.listen(PORT, () => {
  console.log(`Scorevision backend running on http://localhost:${PORT}`);
});
