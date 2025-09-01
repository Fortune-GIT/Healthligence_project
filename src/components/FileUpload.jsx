import React, { useRef } from "react";

/**
 * Lightweight uploader used by RegistrationForm.
 * - Accepts only JPG/JPEG/PDF.
 * - Calls the parent's setter (passed via `onChange`) to append files.
 * 
 * Props:
 *  - title: string (button label)
 *  - type: "id" | "address" (semantic only)
 *  - icon: "download" 
 *  - onChange: React setState function for the corresponding files array
 */
export default function FileUpload({
  title = "Upload",
  type = "id",
  icon = "download",
  onChange,
}) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter to allowed types only (jpg/jpeg/pdf)
    const accepted = files.filter((f) => /\.(jpe?g|pdf)$/i.test(f.name || ""));
    if (accepted.length === 0) return;

    // Append to the existing list (parent passed a setter)
    if (typeof onChange === "function") {
      onChange((prev) => [...(Array.isArray(prev) ? prev : []), ...accepted]);
    }

    // reset input so same file can be selected again if needed
    e.target.value = "";
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;

    // icons
    switch (icon) {
      case "sliders":
        // three vertical sliders
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="mr-2"
          >
            <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="4" cy="11" r="2.2" fill="white" stroke="#334155" strokeWidth="1.5"/>
            <circle cx="12" cy="9" r="2.2" fill="white" stroke="#334155" strokeWidth="1.5"/>
            <circle cx="20" cy="13" r="2.2" fill="white" stroke="#334155" strokeWidth="1.5"/>
          </svg>
        );
      case "download":
      default:
        // tray with arrow (upload/attach)
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="mr-2"
          >
            <path d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 15v3a3 3 0 003 3h10a3 3 0 003-3v-3" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="inline-flex items-center">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.pdf"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <button type="button" onClick={openPicker} className="btn" title={title}>
        {renderIcon()}
        {title}
      </button>
    </div>
  );
}
