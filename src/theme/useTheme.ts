import { useCallback, useEffect, useState } from "react";
import { applyTheme, readStoredMode, resolveTheme, storeMode, watchSystemTheme, type ResolvedTheme, type ThemeMode } from "./theme";

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(mode));

  // 첫 렌더: 인라인 스크립트가 이미 적용했으므로 애니메이션 없이 동기화만
  useEffect(() => { applyTheme(resolved, false); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // system 모드일 때만 OS 설정 변경을 따라감
  useEffect(() => {
    if (mode !== "system") return;
    return watchSystemTheme((t) => { setResolved(t); applyTheme(t, true); });
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    storeMode(m);
    setModeState(m);
    const t = resolveTheme(m);
    setResolved(t);
    applyTheme(t, true);
  }, []);

  return { mode, resolved, setMode };
}
