import React, { useCallback, useEffect, useState } from "react";
import type { DevState } from "./types";
import { DEFAULT_TOKEN } from "./mock/photoData";
import { useTheme } from "./theme/useTheme";
import { Header } from "./components/Header";
import { PhotoLandingPage } from "./components/PhotoLandingPage";
import { DevStateSwitcher, DEV_SWITCHER_ENABLED } from "./components/DevStateSwitcher";

/**
 * /p/:token
 * [SERVER] 실제 도메인은 pathname 사용 + 서버/CDN 에서 /p/* → index.html rewrite.
 * 정적 호스팅·프로토타입에서는 #/p/:token 으로 동일하게 동작.
 */
const ROUTE = /^\/p\/([A-Za-z0-9_-]{3,64})\/?$/;
/** GitHub Pages 처럼 하위 경로(/repo-name/)에 배포돼도 동작하도록 base 를 제거한 뒤 매칭 */
function parseToken(): string | null {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = base && location.pathname.startsWith(base) ? location.pathname.slice(base.length) : location.pathname;
  const hashPath = location.hash.slice(1).split("?")[0]; // "#/p/:token?dev=0" 허용
  return path.match(ROUTE)?.[1] ?? hashPath.match(ROUTE)?.[1] ?? null;
}

export function App() {
  const [token, setToken] = useState(() => parseToken() ?? DEFAULT_TOKEN);
  const [devState, setDevState] = useState<DevState>("normal");
  const { mode, setMode } = useTheme();
  const [ratio, setRatio] = useState(16 / 9);
  const onLayoutRatio = useCallback((r: number) => setRatio(r), []);

  useEffect(() => {
    if (!parseToken()) { try { history.replaceState(null, "", `#/p/${DEFAULT_TOKEN}`); } catch {} }
    const sync = () => { const t = parseToken(); if (t) setToken(t); };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <div className="page">
      {/* 하나의 세로 그리드: 로고 X = 사진 X = 정보 X */}
      <div className="column" style={{ "--ratio": ratio } as React.CSSProperties}>
      <Header />
      <main className="main">
        <PhotoLandingPage key={token} token={token} devState={devState} onDevReset={() => setDevState("normal")} onLayoutRatio={onLayoutRatio} />
      </main>
      </div>
      {DEV_SWITCHER_ENABLED && (
        <DevStateSwitcher
          theme={mode} onTheme={setMode}
          state={devState} onState={setDevState}
        />
      )}
    </div>
  );
}
