import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { runPython } from "../utils/runPython";

type UploadRequest = Request & { file?: { path: string } };

export const handleUpload = async (req: UploadRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  // Resolve analysis dir relative to project root (one level up from dist/)
  const analysisDir = path.resolve(__dirname, "../../analysis");
  const scriptPath = path.join(analysisDir, "analyze.py");

  try {
    const raw = await runPython(scriptPath, [filePath], analysisDir);
    const result = JSON.parse(raw);

    fs.unlink(filePath, () => {});
    res.json(result);
  } catch (err) {
    fs.unlink(filePath, () => {});
    res.status(500).json({ error: "Analysis failed", details: String(err) });
  }
};
