import React from "react";

export const Camera = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <path d="M3 7h4l2-2h6l2 2h4v12H3z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const Upload = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
    <path d="M5 21h14" />
  </svg>
);

export const Sliders = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <path d="M4 21v-7m0-7V3m8 18v-9m0-7V3m8 18v-5m0-9V3" />
    <circle cx="4" cy="10" r="2" />
    <circle cx="12" cy="6" r="2" />
    <circle cx="20" cy="14" r="2" />
  </svg>
);

export const Printer = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <path d="M6 9V2h12v7" />
    <rect x="6" y="13" width="12" height="8" />
    <path d="M6 13H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
  </svg>
);

export const IdCard = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 10h5M7 14h3m6-4v6" />
  </svg>
);

export const Screen = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M7 20h10" />
  </svg>
);

export const Check = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const Calendar = (p) => (
  <svg
    className={`icon ${p.className || ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...p}
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 9h18" />
  </svg>
);
