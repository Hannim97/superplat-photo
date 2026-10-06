import React, { useCallback, useEffect, useState } from "react";
import type { DevState, PhotoData } from "../types";
import { getNow, getPhoto } from "../api/getPhoto";
import { isExpired } from "../utils/formatExpiryDate";
import { PhotoPreview, type ImageStatus } from "./PhotoPreview";
import { ExpiryInfo } from "./ExpiryInfo";
import { SaveHint } from "./SaveHint";
import { LoadingState } from "./LoadingState";
import { ExpiredState } from "./ExpiredState";
import { ErrorState } from "./ErrorState";

type PageState =
  | { status: "loading" }
  | { status: "ready"; photo: PhotoData }
  | { status: "expired" }
  | { status: "error" };

interface Props {
  token: string; devState: DevState; onDevReset: () => void;
  /** 헤더·사진·정보가 같은 좌우 그리드를 쓰도록, 현재 화면의 사진 비율을 상위 컬럼에 전달 */
  onLayoutRatio: (r: number) => void;
}

export function PhotoLandingPage({ token, devState, onDevReset, onLayoutRatio }: Props) {
  const [state, setState] = useState<PageState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [imageStatus, setImageStatus] = useState<ImageStatus>("loading");
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });
    getPhoto(token, ac.signal)
      .then((photo) => {
        if (ac.signal.aborted) return;
        // 404(삭제됨)도 사용자에게는 "기간 만료"로 안내
        if (!photo || isExpired(photo.expiresAt, getNow())) setState({ status: "expired" });
        else {
          setRatio(photo.width && photo.height ? photo.width / photo.height : null);
          setState({ status: "ready", photo });
        }
      })
      .catch((e) => { if (e?.name !== "AbortError") setState({ status: "error" }); });
    return () => ac.abort();
  }, [token, attempt]);

  // 페이지를 열어둔 채 유효 시간이 지나면 만료 화면으로 전환
  useEffect(() => {
    if (state.status !== "ready") return;
    const ms = Date.parse(state.photo.expiresAt) - getNow();
    if (ms > 2 ** 31 - 1) return;
    const t = setTimeout(() => setState({ status: "expired" }), Math.max(0, ms));
    return () => clearTimeout(t);
  }, [state]);

  const onImageStatus = useCallback((s: ImageStatus) => setImageStatus(s), []);

  const showPhoto = devState !== "loading" && devState !== "expired" && state.status === "ready";
  useEffect(() => { onLayoutRatio(showPhoto && ratio ? ratio : 16 / 9); }, [showPhoto, ratio, onLayoutRatio]);

  if (devState === "loading" || state.status === "loading") return <LoadingState />;
  if (devState === "expired" || state.status === "expired") return <ExpiredState />;
  if (state.status === "error") {
    return (
      <div className="stack">
        <div className="photo" data-status="error">
          <ErrorState onRetry={() => setAttempt((a) => a + 1)} />
        </div>
      </div>
    );
  }

  const { photo } = state;
  return (
    <div className="stack">
      <h1 className="sr-only">SuperPlat에서 촬영한 사진</h1>
      <PhotoPreview
        photo={photo}
        simulateError={devState === "imageError"}
        onRetry={devState === "imageError" ? onDevReset : undefined}
        onStatusChange={onImageStatus}
        onRatio={setRatio}
      />
      <div className="info">
        <ExpiryInfo expiresAt={photo.expiresAt} now={getNow()} />
        {imageStatus === "loaded" && <SaveHint />}
      </div>
    </div>
  );
}
