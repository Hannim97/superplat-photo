import React from "react";
import wordmarkBlack from "../assets/brand/superplat-wordmark-black.png";
import wordmarkWhite from "../assets/brand/superplat-wordmark-white.png";

/**
 * 공식 Wordmark 를 그대로 사용 (재구성·recolor·filter 금지)
 *  - Light: Black wordmark / Dark: White wordmark
 *  - 두 이미지를 모두 렌더링하고 html[data-theme] 에 따라 CSS 로 하나만 표시
 *    → 테마 전환 시 새로 로드하지 않아 깜빡임·layout shift 없음
 *  - Vite 가 해시가 붙은 정적 파일로 내보낸다. width/height 로 자리를 미리 잡아 로드 중 layout shift 없음
 */
export function Header() {
  return (
    <header className="header">
      <div className="brand">
        <img className="wordmark wordmark-light" src={wordmarkBlack} width={865} height={256} alt="SuperPlat" decoding="sync" />
        <img className="wordmark wordmark-dark" src={wordmarkWhite} width={865} height={256} alt="SuperPlat" decoding="sync" />
      </div>
    </header>
  );
}
