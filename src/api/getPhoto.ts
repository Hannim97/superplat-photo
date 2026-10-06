import type { PhotoData } from "../types";
import { MOCK_NOW, mockPhotos } from "../mock/photoData";

/**
 * [SERVER] 실제 API 연결: .env 에 VITE_USE_MOCK=false, VITE_API_BASE=https://... 설정
 * (기본값은 Mock)
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const API_BASE = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/$/, "");

export function getNow(): number {
  return USE_MOCK ? Date.parse(MOCK_NOW) : Date.now();
}

/**
 * [SERVER] GET /api/photos/{token} → PhotoData (200) / 404
 * 만료 여부는 expiresAt 으로 판단한다. (서버가 410 을 내려도 ExpiredState 로 처리하면 된다)
 */
export async function getPhoto(token: string, signal?: AbortSignal): Promise<PhotoData | null> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 450));
    if (signal?.aborted) throw new DOMException("aborted", "AbortError");
    return mockPhotos[token] ?? null;
  }
  const res = await fetch(`${API_BASE}/photos/${encodeURIComponent(token)}`, { signal, cache: "no-store" });
  if (res.status === 404 || res.status === 410) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
