import React, { useState } from "react";
import type { DevState } from "../types";
import type { ThemeMode } from "../theme/theme";
import { MonitorIcon, MoonIcon, SunIcon } from "./Icons";

/**
 * 표시 조건
 *  - npm run dev: 항상 표시
 *  - 빌드: VITE_SHOW_DEV_MENU=true 일 때만 (GitHub Pages 프로토타입 배포용). Production 은 미설정 → 제거
 *  - 어느 환경이든 URL 에 ?dev=0 을 붙이면 숨김
 */
export const DEV_SWITCHER_ENABLED =
  (import.meta.env.DEV || import.meta.env.VITE_SHOW_DEV_MENU === "true") &&
  !/[?&]dev=0\b/.test(location.search + location.hash);

const THEMES: Array<[ThemeMode, string, React.ReactNode]> = [
  ["system", "System", <MonitorIcon size={16} />],
  ["light", "Light", <SunIcon size={16} />],
  ["dark", "Dark", <MoonIcon size={16} />],
];
const STATES: Array<[DevState, string]> = [
  ["normal", "Normal"], ["loading", "Loading"], ["expired", "Expired"], ["imageError", "Error"],
];

function Segmented<T extends string>({ label, items, value, on }: {
  label: string; items: Array<[T, string, React.ReactNode?]>; value: T; on: (v: T) => void;
}) {
  const id = `dev-${label}`;
  return (
    <>
      <p className="dev-legend" id={id}>{label}</p>
      <div className="segmented" role="group" aria-labelledby={id}>
        {items.map(([v, text, icon]) => (
          <button key={v} type="button" className="segment" aria-pressed={value === v} onClick={() => on(v)}>
            {icon && <span className="segment-icon">{icon}</span>}
            {text}
          </button>
        ))}
      </div>
    </>
  );
}

interface Props {
  theme: ThemeMode; onTheme: (t: ThemeMode) => void;
  state: DevState; onState: (s: DevState) => void;
}

/** 프로토타입 테스트 전용. Production UI 와 분리된 우측 하단 */
export function DevStateSwitcher(p: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dev">
      {open && (
        <div className="dev-panel" id="dev-panel" role="group" aria-label="프로토타입 설정">
          <Segmented label="Theme" items={THEMES} value={p.theme} on={p.onTheme} />
          <Segmented label="State" items={STATES} value={p.state} on={p.onState} />
        </div>
      )}
      <button type="button" className="dev-toggle" aria-expanded={open} aria-controls="dev-panel" onClick={() => setOpen((o) => !o)}>
        {open ? "닫기" : "Dev"}
      </button>
    </div>
  );
}
