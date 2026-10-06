import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * base
 *  - 로컬 / 루트 도메인 배포(photo.superplat.com): "/"
 *  - GitHub Pages 프로젝트 사이트(username.github.io/repo/): "/repo/"
 *    → .github/workflows/deploy.yml 이 VITE_BASE 를 자동으로 넣어준다.
 */
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
