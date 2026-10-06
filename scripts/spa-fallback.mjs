// GitHub Pages 는 SPA 라우팅을 모르므로, /repo/p/:token 처럼 직접 들어온 경로도
// 앱이 열리도록 index.html 을 404.html 로 복사한다. (#/p/:token 해시 경로는 원래부터 동작)
import { copyFileSync } from "node:fs";
copyFileSync("dist/index.html", "dist/404.html");
console.log("spa-fallback: dist/404.html created");
