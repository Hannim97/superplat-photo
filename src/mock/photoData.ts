import type { PhotoData } from "../types";

import bmaPhotoUrl from "../assets/mock/bma-photo-001.png";

/**
 * [PROTOTYPE] 기획안 예시 데이터(9월 24일 15시 만료)를 그대로 보여주기 위해
 * 프로토타입은 "현재 시각"을 2026-09-23 15:00 KST 로 고정한다.
 * [SERVER] 실제 서비스에서는 Date.now() 를 사용한다. (api/getPhoto.ts 의 getNow)
 */
export const MOCK_NOW = "2026-09-23T15:00:00+09:00";

export const DEFAULT_TOKEN = "bma-photo-001";

/**
 * 테스트 사진: BMA 갈매기 도슨트 (원본 PNG 1920×1080, 무가공)
 * [SERVER] 실제 서비스에서는 GET /api/photos/{token} 응답의 imageUrl 로 대체된다.
 */
const bmaPhoto: Omit<PhotoData, "id" | "expiresAt" | "createdAt"> = {
  imageUrl: bmaPhotoUrl,
  width: 1920,
  height: 1080,
};

export const mockPhotos: Record<string, PhotoData> = {
  "bma-photo-001": {
    id: "bma-photo-001",
    ...bmaPhoto,
    createdAt: "2026-09-23T14:30:00+09:00",
    expiresAt: "2026-09-24T15:00:00+09:00",
  },
  // 만료 상태 확인용 (/p/exp001)
  exp001: {
    id: "exp001",
    ...bmaPhoto,
    createdAt: "2026-09-22T11:00:00+09:00",
    expiresAt: "2026-09-23T12:00:00+09:00",
  },
};
