import React from "react";
import { ClockIcon } from "./Icons";

/** 사진 영역을 숨기고 결과 화면만. 경고색·버튼 없음 */
export function ExpiredState() {
  return (
    <section className="result" aria-labelledby="expired-title">
      <div className="result-icon"><ClockIcon /></div>
      <h1 id="expired-title" className="result-title">사진을 더 이상 볼 수 없어요</h1>
      <p className="result-desc">
        QR 링크의 사용 시간이 지났어요.<br />
        촬영한 화면에서 새로운 QR을 만들어 주세요.
      </p>
    </section>
  );
}
