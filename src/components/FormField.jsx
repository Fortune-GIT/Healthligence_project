import React from "react";

/* wrapper for non-box controls (e.g., Gender, Age, DOB) */
export default function FormField({
  label,
  children,
  error = "",
  className = "",
}) {
  return (
    <div className={className}>
      {label ? <label className="mb-1 block text-xs text-slate-600">{label}</label> : null}
      {children}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
}

/* floating input – shows label INSIDE the box */
export function FloatingInput({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  rightAddon,
}) {
  return (
    <div className="fl">
      <span className="fl-label">{label}</span>
      <input
        type={type}
        className="fl-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder=""
        aria-label={label}
      />
      {rightAddon ? <div className="fl-right">{rightAddon}</div> : null}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
}

/* tiny 48×40 inputs with mini label (YY/MM/DD) */
export function TinyBox({
  label,
  value,
  onChange,
  inputMode = "text",
  maxLength,
}) {
  return (
    <div className="tinywrap">
      <span className="tinylabel">{label}</span>
      <input
        className="tinybox"
        value={value}
        inputMode={inputMode}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          const trimmed = maxLength ? v.slice(0, maxLength) : v;
          onChange?.(trimmed);
        }}
        aria-label={label}
      />
    </div>
  );
}
