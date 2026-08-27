# SKALA Vue.js 실습 (Weather Dashboard)

Vue 3 (Composition API) + Vue Router + Pinia + Axios로 만든 날씨 대시보드 실습 프로젝트입니다.

## 기술 스택

- Vue 3 (`<script setup>`, Composition API)
- Vue Router 4
- Pinia
- Axios
- OpenWeatherMap API (실시간 날씨, 대기질)
- QuoteSlate API (명언)

## Project Setup

```sh
npm install
```

`.env` 파일에 아래 값이 필요합니다 (레포에는 포함되어 있지 않음, 보안상 gitignore 처리):

```
VITE_OWM_API_KEY=발급받은_OpenWeatherMap_API_키
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## 실습 진행 기록

### 1. Weather Mockup

정적 mock 데이터로 6개 도시(서울/용인/부산/제주/춘천/독도)의 날씨를 카드 그리드로 배치.

**트러블슈팅 — 카드 그리드가 왼쪽으로 치우침**
Vue 기본 스캐폴드의 `#app` 스타일이 1024px 이상 화면에서 2단 그리드로 동작해서, 컴포넌트가 그리드의 첫 칸에만 배치되어 왼쪽으로 쏠려 보임. 전역 CSS는 건드리지 않고, 컴포넌트 자신의 최상위 래퍼에 `display: flex; justify-content: center; width: 100%;`를 적용해 컴포넌트 스스로 중앙 정렬되도록 처리.

### 2. Weather Composition

Composition API(`ref`, `computed`, `watch`, `watchEffect`)를 활용해 검색 필터링, 선택된 도시 상태 표시, 즐겨찾기 기능을 하나의 컴포넌트 안에 구현.

### 3. Weather Component

`WeatherComposition.vue`를 역할별로 분리:

- `WeatherParent.vue` — 상태와 로직을 소유하는 부모
- `BaseDashboardCard.vue` — 기본 슬롯 기반 카드 껍데기 (검색창/카드 목록 영역에 재사용)
- `SearchBar.vue` — 검색 입력 (props/emit)
- `WeatherCard.vue` — 도시 하나를 표시하는 카드 (props/emit)
- `FavoriteButton.vue` (보너스) — 즐겨찾기 별 버튼을 WeatherCard에서 한 번 더 분리

**커스터마이징 — 죽은 CSS 정리**
FavoriteButton 분리 과정에서 WeatherCard.vue에 남아있던 `.star-btn`, `.star-btn.starred` 스타일을 제거하고 FavoriteButton.vue로 이동.

### 4. Weather Router

Vue Router로 페이지 분리: `WeatherHomeView`(홈), `WeatherDetailView`(상세, 동적 세그먼트 `:cityId`), `WeatherAboutView`(소개), `NotFoundView`(404, catch-all). 모든 라우트는 lazy loading 적용.

보너스로 `WeatherStatsView.vue`(통계 페이지: 평균 기온/최고/최저/맑은 도시 수)를 추가 구현.

`window.alert()` 기반 상세보기를 `router.push()` 기반 페이지 이동으로 교체.

**트러블슈팅 — 내비게이션 바가 세로로 긴 박스로 깨짐**
`App.vue`에 `<nav>`와 `<RouterView />`를 나란히 배치했더니, Weather Mockup 때와 동일한 원인(`#app`의 2단 그리드)으로 nav가 왼쪽에 세로로 길게 렌더링됨. `<div class="app-shell">`로 감싸고 `grid-column: 1 / -1;`을 줘서 그리드 칸 전체를 차지하도록 해결.

### 5. Weather Store (Pinia)

`stores/configStore.js` — 날씨 단위(섭씨/화씨) 상태 관리 (state: `unit`, getters: `unitSymbol`, actions: `toggleUnit`). `UnitToggler.vue`를 만들어 Navigation Bar 옆에 배치하고, 메인/상세 페이지의 `displayTemp` computed에서 단위 변환 적용.

보너스로 `stores/favoriteStore.js`를 직접 설계: 기존에는 즐겨찾기가 도시 1개만 가능한 로컬 state였는데, Pinia store + 배열 구조로 바꿔서 여러 도시를 동시에 즐겨찾기할 수 있게 확장. Pinia는 앱 전체에서 공유되는 상태라, Weather Router 단계에서는 페이지 이동 시 사라졌던 즐겨찾기 정보를 이제는 통계 페이지(`WeatherStatsView`)에서도 그대로 확인할 수 있음.

### 6. Weather Axios

Axios + OpenWeatherMap API로 실제 날씨 데이터 연동.

- **요구사항 1**: 6개 도시의 실시간 날씨(기온/상태)를 `Promise.all`로 병렬 조회해 반영. 독도는 도시명 검색이 되지 않아 위도/경도로 별도 조회.
- **요구사항 2**: OpenWeatherMap Air Pollution API를 추가 연동해 카드에 미세먼지 등급(좋음/양호/보통/나쁨/매우나쁨) 뱃지 표시.
- **요구사항 3**: OpenWeatherMap과 무관한 외부 API인 QuoteSlate(명언 API)를 연동해 대시보드 상단에 "오늘의 한마디" 배너 추가.
- API 키는 `.env`(`VITE_OWM_API_KEY`)로 분리해 코드에 직접 노출하지 않음.

**트러블슈팅 — 계속 401 Unauthorized**
API 키를 발급받고도 계속 인증 실패가 발생해서, 다른 키로 바꿔서 테스트해본 결과 코드 자체는 정상이었음. 원인은 프로젝트에 `.env` 파일 자체를 생성하지 않아 `API_KEY` 값이 `undefined`로 전달되고 있었던 것. `.env` 파일 생성 후 dev 서버 재시작으로 해결. (Vite는 `.env`를 서버 시작 시점에만 읽기 때문에, 파일 생성/수정 후에는 반드시 재시작 필요.)

---

## 배운 점

Vue 기본 스캐폴드의 `#app` 반응형 그리드 레이아웃이 여러 핸즈온 단계(Mockup, Router)에서 반복적으로 같은 유형의 레이아웃 버그를 만들었는데, 원인을 한 번 이해하고 나니 이후에는 훨씬 빠르게 진단하고 해결할 수 있었습니다.
