import { Router } from "express";
import multer from "multer";
import { handleUpload } from "../controllers/uploadController";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = [".csv", ".json", ".xlsx", ".xls", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, JSON, XLSX, XLS, and TXT files are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), handleUpload);

export default router;
