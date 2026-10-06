# SuperPlat | Photo

SuperPlat에서 촬영한 사진을 QR 코드로 열어 확인하고 저장하는 랜딩페이지입니다.

```
QR 스캔 → /p/:token → 사진 확인 → 사진을 길게 눌러 저장
```

- React 19 + TypeScript + Vite, 외부 UI 라이브러리 없음
- Light / Dark / System 테마
- 저장은 브라우저 기본 기능(이미지 길게 누르기 · 우클릭)을 사용합니다. 별도 다운로드 로직은 없습니다.

---

## 빠른 시작

Node.js 18.18 이상(권장 20)이 필요합니다.

```bash
npm install
npm run dev
```

터미널에 표시되는 주소로 접속합니다.

- PC: `http://localhost:5173/`
- 같은 Wi-Fi의 휴대폰: `http://<PC IP>:5173/` (`--host` 옵션이 켜져 있음)

토큰 없이 열면 테스트 사진(`#/p/bma-photo-001`)으로 이동합니다.

| 스크립트 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (Dev 메뉴 항상 표시) |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| `npm run build:pages` | GitHub Pages용 빌드 (`404.html` 포함) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | TypeScript 타입 검사 |

> 처음 `npm install` 후 생성되는 `package-lock.json`을 커밋해 주세요. 이후 CI에서 `npm ci`로 바꾸면 설치 버전이 고정됩니다.

---

## 화면 상태와 Dev 메뉴

우측 하단 **Dev** 버튼으로 다음 두 가지를 바꿔 볼 수 있습니다.

- **Theme**: System / Light / Dark
- **State**: Normal / Loading / Expired / Error

Error는 실제로 깨진 이미지 URL을 넣어 `onError` 경로를 그대로 타는 방식입니다.

Dev 메뉴 표시 조건은 다음과 같습니다.

- `npm run dev`: 항상 표시
- 빌드 결과물: `VITE_SHOW_DEV_MENU=true`일 때만 표시. 실서비스 빌드에서는 설정하지 마세요.
- 어떤 환경이든 URL에 `?dev=0`을 붙이면 숨겨집니다. 예: `#/p/bma-photo-001?dev=0`

테스트용 토큰은 두 가지입니다.

| URL | 결과 |
|---|---|
| `#/p/bma-photo-001` | 정상 (QR 유효 시간: 9월 24일 15시까지) |
| `#/p/exp001` | 만료 화면 |
| 그 외 토큰 | 만료 화면 (서버의 404와 같은 처리) |

> 기획안의 예시 날짜를 그대로 보여주기 위해, Mock 모드에서는 현재 시각을 `2026-09-23 15:00 KST`로 고정합니다(`src/mock/photoData.ts`의 `MOCK_NOW`). 실제 API 모드에서는 `Date.now()`를 씁니다.

---

## 폴더 구조

```
index.html                  첫 페인트 전 테마 적용 스크립트, favicon, theme-color
public/                     favicon · 앱 아이콘 · manifest (공식 S 아이콘에서 생성)
scripts/spa-fallback.mjs    GitHub Pages용 404.html 복사
src/
  main.tsx
  App.tsx                   라우팅 (/p/:token, #/p/:token), Dev 메뉴 연결
  api/getPhoto.ts           ★ 서버 연동 위치 (Mock / 실제 API 전환)
  mock/photoData.ts         Mock 데이터, 고정 현재 시각
  utils/formatExpiryDate.ts "9월 24일 15시까지" 포맷
  theme/                    테마 상태 · localStorage · 시스템 테마 감지
  components/
    Header.tsx              공식 워드마크 (Light: 검정 / Dark: 흰색)
    PhotoLandingPage.tsx    페이지 상태 관리
    PhotoPreview.tsx        ★ 사진 <img> (길게 누르기 저장)
    ExpiryInfo.tsx          QR 유효 시간
    SaveHint.tsx            저장 안내 (입력 방식에 따라 문구 전환)
    LoadingState.tsx / ExpiredState.tsx / ErrorState.tsx
    DevStateSwitcher.tsx    프로토타입 전용
  assets/brand/             공식 로고 원본 (수정 금지)
  assets/mock/              테스트 사진 원본 (무가공)
  styles.css                디자인 토큰 + 전체 스타일
```

---

## 실제 서버 연결

### 1. 환경 변수 설정

`.env.example`을 `.env.local`로 복사한 뒤 값을 바꿉니다.

```bash
VITE_USE_MOCK=false
VITE_API_BASE=https://photo.superplat.com/api
```

### 2. API 응답 형식

호출 경로는 `GET {VITE_API_BASE}/photos/{token}`입니다. 처리 코드는 `src/api/getPhoto.ts`에 있습니다.

```json
{
  "id": "bma-photo-001",
  "imageUrl": "https://cdn.superplat.com/photos/....png",
  "createdAt": "2026-09-23T14:30:00+09:00",
  "expiresAt": "2026-09-24T15:00:00+09:00",
  "width": 1920,
  "height": 1080
}
```

| 상태 코드 | 화면 |
|---|---|
| 200 | 사진 표시. 단, `expiresAt`이 지났으면 만료 화면 |
| 404 · 410 | 만료 화면 |
| 그 외 오류 · 네트워크 실패 | 오류 화면 + 다시 시도 |

`width` / `height`는 선택 항목이지만 꼭 넣어 주세요. 로딩 중에 사진 영역을 정확한 비율로 미리 잡아 layout shift를 막습니다.

### 3. 이미지 URL 조건

- 브라우저가 바로 표시할 수 있는 JPG / PNG / WebP URL이어야 합니다.
- 길게 눌러 저장할 때 사용자 기기에 이 파일이 그대로 저장됩니다. 원본 해상도 URL을 권장합니다.
- 페이지에서는 `<img>`로 표시만 하므로 CDN CORS 설정은 필요 없습니다.

### 4. 경로 라우팅 (실서비스 도메인)

`https://photo.superplat.com/p/abc123`처럼 해시 없는 경로를 쓰려면, 서버나 CDN에서 `/p/*` 요청을 `index.html`로 rewrite해야 합니다. 해시 경로(`/#/p/abc123`)는 설정 없이 동작합니다.

---

## ⚠️ 사진 길게 누르기 저장: 지켜야 할 규칙

이 페이지의 핵심 기능입니다. 아래 규칙은 수정할 때도 반드시 유지해 주세요. 관련 주석은 `PhotoPreview.tsx`와 `styles.css`에 있습니다.

- 사진은 반드시 실제 `<img>` 요소로 렌더링합니다. `background-image`나 `canvas`를 쓰지 않습니다.
- 다음 코드를 사용하지 않습니다.
  - `pointer-events: none`
  - `-webkit-touch-callout: none`
  - 사진과 그 상위 요소의 `user-select: none`
  - `contextmenu` 이벤트의 `preventDefault()`
- 사진을 `<a>`로 감싸지 않습니다. 감싸면 링크 메뉴가 이미지 메뉴보다 먼저 뜹니다.
- 로드가 끝난 뒤에는 사진 위에 다른 요소(오버레이, 로더 등)를 겹치지 않습니다.
- 사진에 다음을 적용하지 않습니다. 테마가 바뀌어도 원본 색을 유지해야 합니다.
  - `filter`, `opacity`, `mix-blend-mode`
  - 어두운 오버레이, 그라디언트 오버레이
- `crossOrigin`, `loading="lazy"`, `draggable={false}`는 쓰지 않습니다.

---

## 테마

- 기본값은 System이며, OS의 `prefers-color-scheme`을 따릅니다.
- Light 또는 Dark를 직접 선택하면 `localStorage`의 `superplat-theme` 키에 저장됩니다.
- `index.html`의 인라인 스크립트가 React보다 먼저 `<html data-theme>`과 `theme-color`를 설정합니다. 덕분에 다크 모드 사용자가 흰 화면을 잠깐 보는 현상이 없습니다.
- 테마를 바꾸는 순간에만 배경·글자·테두리 색이 200ms 동안 전환됩니다. 사진(`<img>`)은 전환에서 제외됩니다.
- 실서비스 화면에는 테마 전환 UI가 없습니다. QR로 잠깐 들어오는 목적형 페이지이기 때문입니다.
- 색상 토큰은 `src/styles.css` 상단에 있습니다(`--page-bg`, `--text-primary` 등). 컴포넌트 CSS에는 원색 hex 값을 직접 쓰지 않습니다.

---

## 브랜드 에셋

| 파일 | 용도 |
|---|---|
| `src/assets/brand/superplat-wordmark-black.png` | Light 헤더 (865×256) |
| `src/assets/brand/superplat-wordmark-white.png` | Dark 헤더 |
| `src/assets/brand/superplat-icon-light-512.png` | 흰 배경 + 검정 S (원본) |
| `src/assets/brand/superplat-icon-dark-512.png` | 검정 배경 + 흰 S (원본) |
| `public/favicon-light.png` · `favicon-dark.png` | OS 테마에 따라 바뀌는 favicon (32px) |
| `public/apple-touch-icon.png` | iOS 홈 화면 (180px, 검정 S) |
| `public/android-chrome-*.png` | Android / manifest |

- 로고는 공식 이미지만 사용합니다. 재작성, recolor, filter, 변형은 하지 않습니다.
- 워드마크 크기는 모바일 86px, 1024px 이상 100px이며 원본 비율을 유지합니다.
- Light/Dark 워드마크를 둘 다 렌더링하고 CSS로 하나만 보여줍니다. 그래서 테마를 바꿀 때 다시 로딩하거나 깜빡이지 않습니다.
- `apple-touch-icon`은 검정 배경 아이콘을 씁니다. iOS가 투명한 모서리를 검정으로 채우기 때문에, 흰 배경 아이콘을 쓰면 모서리에 검은 테두리가 생깁니다.

---

## 폰트 (Pretendard)

현재는 Pretendard가 설치된 기기에서만 적용되고, 나머지는 시스템 서체로 표시됩니다. 실서비스에서는 아래 둘 중 한 가지 방법으로 Pretendard를 넣어 주세요.

**방법 1. npm 패키지**

```bash
npm install pretendard
```

```ts
// src/main.tsx 상단에 추가
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
```

**방법 2. 직접 호스팅**

`public/fonts/`에 woff2 파일을 넣고, `styles.css` 상단에 `@font-face`를 추가합니다.

`font-family`는 이미 `"Pretendard Variable", Pretendard, ...` 순서로 지정되어 있어서 추가 수정은 필요 없습니다.

---

## GitHub Pages 배포

`.github/workflows/deploy.yml`이 포함되어 있어서, `main` 브랜치에 push하면 자동으로 빌드하고 배포합니다.

1. GitHub에서 새 저장소를 만듭니다. 예: `superplat-photo`
2. 이 폴더를 push합니다.
   ```bash
   git init
   git add .
   git commit -m "SuperPlat photo landing prototype"
   git branch -M main
   git remote add origin https://github.com/<USER>/superplat-photo.git
   git push -u origin main
   ```
3. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다. 최초 1회만 하면 됩니다.
4. **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로가 성공하면, 다음 주소로 접속됩니다.
   ```
   https://<USER>.github.io/superplat-photo/#/p/bma-photo-001
   ```

배포 관련 참고 사항입니다.

- 워크플로가 저장소 이름에 맞는 base 경로(`/superplat-photo/`)를 자동으로 넣어 줍니다. 저장소 이름을 바꿔도 따로 수정할 필요가 없습니다.
- 프로토타입 리뷰용 배포라 `VITE_SHOW_DEV_MENU: "true"`로 설정되어 있습니다. 실서비스 배포 파이프라인에서는 이 값을 빼세요.
- GitHub Pages는 SPA 경로를 지원하지 않습니다. 그래서 빌드 시 `404.html`을 함께 만들어 `/p/:token` 경로도 열리게 했습니다. 다만 응답 상태 코드가 404이므로, 공유용 링크는 해시 경로(`/#/p/:token`)를 권장합니다.
- 비공개 저장소에서 Pages를 쓰려면 GitHub 유료 플랜이 필요할 수 있습니다. 배포된 Pages 사이트 자체는 누구나 열 수 있는 공개 주소입니다.

---

## 실기기 테스트 체크리스트

GitHub Pages나 실서비스 도메인처럼 HTTPS 주소에 올린 뒤 확인합니다.

| 기기 / 브라우저 | 확인할 동작 |
|---|---|
| iPhone Safari | 사진 길게 누르기 → "사진에 저장" |
| iPhone Chrome | 사진 길게 누르기 → 이미지 저장 |
| Android Chrome | 사진 길게 누르기 → "이미지 다운로드" |
| Samsung Internet | 사진 길게 누르기 → 이미지 저장 |
| iPad Safari | 길게 누르기 저장, 안내 문구 표시 (트랙패드 연결 시에도 확인) |
| Desktop Chrome / Edge / Safari / Firefox | 우클릭 → 이미지를 다른 이름으로 저장 |
| 카카오톡 · 인스타그램 인앱 브라우저 | 길게 누르기 메뉴가 앱마다 다름 (메신저로 QR 링크를 공유받는 경우 대비) |

공통으로 확인할 항목입니다.

- [ ] 저장된 파일이 원본 사진과 같은가 (해상도, 색상)
- [ ] 다크 모드로 처음 접속할 때 흰 화면이 깜빡이지 않는가
- [ ] 가로 스크롤이 생기지 않는가
- [ ] 390×844 기준으로 사진, QR 유효 시간, 안내 문구가 첫 화면 안에 모두 보이는가
