import { useRef, useState } from "react";
import axios from "axios";
import { FaCloudArrowUp, FaFileCsv } from "react-icons/fa6";
export const UploadFile = ({ onSuccess, onError, onloading }) => {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState(null);
    const inputRef = useRef(null);
    const handleFile = async (file) => {
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
            const res = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 6000,
            });
            if (res.data.success) {
                onSuccess(res.data);
            }
            else {
                onError("Analysis returned an unsuccessful response.");
            }
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.error ||
                    err.message ||
                    "Upload failed";
                onError(msg);
            }
            else {
                onError("An unexpected error occurred.");
            }
        }
    };
    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file)
            handleFile(file);
    };
    const onInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file)
            handleFile(file);
    };
    return (<>
      <div className={`upload-zone ${dragging ? "upload-zone--dragging" : ""}`} onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
        }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => inputRef.current?.click()} role="button" tabIndex={0} aria-label="Upload CSV, TXT, JSON, or Excel file" onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
            }
        }}>
        {fileName ? (<>
            <FaFileCsv className="upload-zone_icon upload-zone_icon--active" aria-hidden="true"/>
            <p className="upload-zone_filename">{fileName}</p>
          </>) : (<>
            <FaCloudArrowUp className="upload-zone_icon" aria-hidden="true"/>
            <p className="upload-zone_title">
              Drop your CSV or Excel file here
            </p>
            <p className="upload-zone_sub">or click to browse</p>
            <p className="upload-zone_hint">
              Supports .csv · .xlsx · .xls — max 10 MB
            </p>
          </>)}
      </div>
      <input type="file" ref={inputRef} accept=".csv, .txt, .json, .xlsx, .xls" className="upload-zone__input" onChange={onInputChange} aria-hidden="true" style={{ display: "none" }}/>
    </>);
};
