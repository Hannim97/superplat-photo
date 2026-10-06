import React from "react";

/** Lucide 스타일 1.5px rounded outline. 색은 currentColor 상속 */
const base = (size: number) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true, focusable: false,
});


export const ClockIcon = ({ size = 28 }: { size?: number }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.75V12l2.75 1.75" />
  </svg>
);

export const SunIcon = ({ size = 20 }: { size?: number }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.75v1.5M12 19.75v1.5M4.75 12h-1.5M20.75 12h-1.5M6.87 6.87 5.81 5.81M18.19 18.19l-1.06-1.06M6.87 17.13l-1.06 1.06M18.19 5.81l-1.06 1.06" />
  </svg>
);

export const MoonIcon = ({ size = 20 }: { size?: number }) => (
  <svg {...base(size)}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);

export const MonitorIcon = ({ size = 20 }: { size?: number }) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="12.5" rx="2.5" />
    <path d="M8.5 20.25h7M12 16.5v3.75" />
  </svg>
);

