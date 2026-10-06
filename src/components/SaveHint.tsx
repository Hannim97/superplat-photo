import React from "react";

/**
 * 저장 안내 (Mobile-first)
 *  - 기본(터치·판별 불가 환경): "사진을 길게 눌러 저장해 주세요."
 *  - 주 입력이 마우스인 환경만 (hover: hover) and (pointer: fine) 미디어 쿼리로 데스크톱 문구로 교체
 *  - User-Agent 판별 없음. 두 문구 중 화면에 보이는 하나만 스크린리더에 읽힘 (display: none)
 *  - CTA 처럼 보이지 않도록 텍스트만 사용 (버튼·박스·아이콘·강조색 없음)
 */
export function SaveHint() {
  return (
    <p className="hint">
      <span className="hint-touch">사진을 길게 눌러 저장해 주세요.</span>
      <span className="hint-mouse">사진을 마우스 오른쪽 버튼으로 눌러 저장해 주세요.</span>
    </p>
  );
}
