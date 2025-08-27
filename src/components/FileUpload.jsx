import React, { useRef, useState } from "react";
import { Upload } from "./Icons";

// Only allow JPG/JPEG/PDF
const ACCEPT = ["image/jpeg", "image/jpg", "application/pdf"];

export default function FileUpload({
  title = "Upload",
  type = "id",                // "id" or "address" 
  onChange,                   // (filesArray) => void
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]); // [{name, type, size, fileObject}]

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (fileList) => {
    const selected = Array.from(fileList || []);
    const valid = selected.filter((f) => ACCEPT.includes(f.type));
    if (valid.length !== selected.length) {
      alert("Only JPG/JPEG or PDF files are allowed.");
    }
    const next = [
      ...files,
      ...valid.map((f) => ({ name: f.name, type: f.type, size: f.size, file: f })),
    ];
    setFiles(next);
    onChange?.(next);
  };

  const removeAt = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <div className="inline-flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,application/pdf"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button type="button" className="btn" onClick={openPicker}>
        <Upload className="icon-muted" />
        {title}
      </button>

      {/* filenames with remove */}
      <div className="flex flex-wrap items-center gap-3">
        {files.map((f, i) => (
          <div key={`${f.name}-${i}`} className="inline-flex items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-md border border-slate-200 bg-white">
              {f.name}
            </span>
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={() => removeAt(i)}
              aria-label={`remove ${f.name}`}
            >
              remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
