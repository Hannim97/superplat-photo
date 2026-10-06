export interface PhotoData {
  id: string;
  /** 브라우저가 바로 표시할 수 있는 JPG / PNG / WebP URL */
  imageUrl: string;
  createdAt: string;
  expiresAt: string;
  /** [SERVER] 가능하면 원본 크기를 함께 내려주세요. 로딩 중 사진 영역을 정확한 비율로 확보합니다. */
  width?: number;
  height?: number;
}

export type DevState = "normal" | "loading" | "expired" | "imageError";
