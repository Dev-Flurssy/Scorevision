import { useRef, useState, DragEvent, ChangeEvent } from "react";
import type { AnalysisResult } from "../types/dataTypes";
import axios from "axios";
import { FaCloudArrowUp, FaFileCsv } from "react-icons/fa6";
import { API_BASE } from "../config/api";

interface Props {
  onSuccess: (data: AnalysisResult) => void;
  onError: (message: string) => void;
  onloading: () => void;
}

export const UploadFile = ({ onSuccess, onError, onloading }: Props) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const allowed = [".csv", ".json", ".xlsx", ".xls", ".txt"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowed.includes(ext)) {
      onError("CSV, TXT, JSON, and Excel (.xlsx, .xls) are the only file types accepted.");
      return;
    }

    setFileName(file.name);
    onloading();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post<AnalysisResult>(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      if (res.data.success) {
        onSuccess(res.data);
      } else {
        onError("Analysis returned an unsuccessful response.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { error?: string })?.error ||
          err.message ||
          "Upload failed";
        onError(msg);
      } else {
        onError("An unexpected error occurred.");
      }
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <>
      <div
        className={`upload-zone ${dragging ? "upload-zone-dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV, TXT, JSON, or Excel file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {fileName ? (
          <>
            <FaFileCsv className="upload-zone-icon upload-zone-icon-active" aria-hidden="true" />
            <p className="upload-zone-filename">{fileName}</p>
          </>
        ) : (
          <>
            <FaCloudArrowUp className="upload-zone-icon" aria-hidden="true" />
            <p className="upload-zone-title">Drop your CSV or Excel file here</p>
            <p className="upload-zone-sub">or click to browse</p>
            <p className="upload-zone-hint">Supports .csv · .xlsx · .xls — max 10 MB</p>
          </>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        accept=".csv, .txt, .json, .xlsx, .xls"
        className="upload-zone-input"
        onChange={onInputChange}
        aria-hidden="true"
      />
    </>
  );
};
