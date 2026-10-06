import React from "react";

/** 사진 자리에서 바로 다시 시도. 이 화면의 유일한 버튼이라 Primary 하나만 사용 */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="photo-error" role="alert">
      <p className="photo-error-title">사진을 불러오지 못했어요</p>
      <p className="photo-error-desc">잠시 후 다시 시도해 주세요.</p>
      <button type="button" className="btn-primary" onClick={onRetry}>다시 시도</button>
    </div>
  );
}
