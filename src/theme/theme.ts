/**
 * Theme: system | light | dark
 *  - 기본값 system (OS prefers-color-scheme 를 따름)
 *  - 직접 고른 값은 localStorage 에 저장해 다음 방문에도 유지
 *  - 첫 페인트 전 적용은 index.html <head> 의 인라인 스크립트가 담당 (FOUC 방지, build.sh 참고)
 */
export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "superplat-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** 브라우저 UI(주소창) 색. --bg-primary 와 같은 값 */
export const THEME_COLOR: Record<ResolvedTheme, string> = { light: "#FFFFFF", dark: "#202027" };

export function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  } catch {
    return "system";
  }
}

export function storeMode(mode: ThemeMode) {
  try { localStorage.setItem(THEME_STORAGE_KEY, mode); } catch { /* 저장 불가 환경: 이번 방문에만 적용 */ }
}

export function systemTheme(): ResolvedTheme {
  return window.matchMedia?.(DARK_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? systemTheme() : mode;
}

/** html[data-theme] + meta theme-color 갱신. animate=true 면 색 속성만 200ms 전환 (사진 제외) */
export function applyTheme(theme: ResolvedTheme, animate = false) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  if (animate) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 260);
  }
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

export function watchSystemTheme(cb: (t: ResolvedTheme) => void): () => void {
  const mq = window.matchMedia?.(DARK_QUERY);
  if (!mq) return () => {};
  const handler = () => cb(mq.matches ? "dark" : "light");
  mq.addEventListener?.("change", handler);
  return () => mq.removeEventListener?.("change", handler);
}
