/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "false" 이면 실제 API 사용. 기본은 Mock */
  readonly VITE_USE_MOCK?: string;
  /** 실제 API 주소. 기본 "/api" */
  readonly VITE_API_BASE?: string;
  /** "true" 이면 빌드 결과물에도 Dev 메뉴 표시 (프로토타입 공유용) */
  readonly VITE_SHOW_DEV_MENU?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
