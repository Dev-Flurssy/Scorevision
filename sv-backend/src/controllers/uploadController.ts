import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { runPython } from "../utils/runPython";

type UploadRequest = Request & { file?: { path: string } };

export const handleUpload = async (req: UploadRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const scriptPath = path.resolve("analysis/analyze.py");

  try {
    const raw = await runPython(scriptPath, [filePath]);
    const result = JSON.parse(raw);

    fs.unlink(filePath, () => {});
    res.json(result);
  } catch (err) {
    fs.unlink(filePath, () => {});
    res.status(500).json({ error: "Analysis failed", details: String(err) });
  }
};
