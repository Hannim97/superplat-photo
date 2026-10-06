import React, { useEffect, useRef, useState } from "react";
import type { PhotoData } from "../types";
import { ErrorState } from "./ErrorState";
import { DotLoader } from "./LoadingState";

export type ImageStatus = "loading" | "loaded" | "error";

interface Props {
  photo: PhotoData;
  /** Dev: 실제 onError 경로를 타도록 깨진 URL 로 교체 */
  simulateError?: boolean;
  onRetry?: () => void;
  onStatusChange?: (s: ImageStatus) => void;
  onRatio?: (r: number) => void;
}

const BROKEN_SRC = "data:image/jpeg;base64,AAAA";

/**
 * 사진은 반드시 실제 <img> 로 렌더링한다. (길게 누르기 → 브라우저 기본 이미지 메뉴)
 *  - background-image / canvas 사용 안 함
 *  - pointer-events · -webkit-touch-callout · user-select 를 막지 않음
 *  - contextmenu 를 preventDefault 하지 않음
 *  - 로드 후에는 이미지 위에 겹치는 요소가 없음 (로더는 로딩 중에만 존재)
 *  - <a> 로 감싸지 않음, crossOrigin · draggable=false · loading="lazy" 미사용
 */
export function PhotoPreview({ photo, simulateError, onRetry, onStatusChange, onRatio }: Props) {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const src = simulateError ? BROKEN_SRC : photo.imageUrl;

  useEffect(() => {
    setStatus("loading");
    // 캐시된 이미지는 onLoad 가 붙기 전에 로드가 끝날 수 있다
    const img = imgRef.current;
    if (img?.complete) setStatus(img.naturalWidth > 0 ? "loaded" : "error");
  }, [src, attempt]);

  useEffect(() => { onStatusChange?.(status); }, [status, onStatusChange]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) onRatio?.(w / h); // 서버가 width/height 를 안 줘도 실제 비율로 보정
    setStatus("loaded");
  };

  const retry = () => {
    setAttempt((a) => a + 1); // 새 <img> 요소 → 브라우저가 다시 요청
    onRetry?.();
  };

  return (
    <div className="photo" data-status={status}>
      {status === "error" ? (
        <ErrorState onRetry={retry} />
      ) : (
        <>
          <img
            key={attempt}
            ref={imgRef}
            className="photo-img"
            src={src}
            alt="SuperPlat에서 촬영한 사진"
            width={photo.width}
            height={photo.height}
            decoding="async"
            fetchPriority="high"
            onLoad={handleLoad}
            onError={() => setStatus("error")}
          />
          {status === "loading" && (
            <div className="photo-placeholder" role="status">
              <DotLoader />
              <span>사진을 불러오고 있어요.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
