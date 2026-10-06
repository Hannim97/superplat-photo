import React from "react";

export function DotLoader() {
  return (
    <span className="dots" aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

/** 사진 정보를 받아오는 동안. 비율을 아직 모르면 16:9 로 영역을 확보한다 */
export function LoadingState() {
  return (
    <div className="stack" aria-busy="true">
      <div className="photo" data-status="loading">
        <div className="photo-placeholder" role="status">
          <DotLoader />
          <span>사진을 불러오고 있어요.</span>
        </div>
      </div>
    </div>
  );
}
