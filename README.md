# SKALA Vue.js 실습 (Weather Dashboard)

---

## 실습 진행 기록

### 0. Project Scaffolding

`npm create vue@latest`로 `skala-vue` 프로젝트를 처음 생성하면서 Vue Router와 Pinia를 함께 추가하도록 옵션을 선택했다. `npm install`로 의존성을 설치하고 `npm run dev`로 개발 서버를 띄운 뒤, 브라우저에서 기본 스캐폴드 화면이 뜨는 것을 확인했다.

`src/views/AboutView.vue`의 템플릿 내용을 바꿔보면서 저장하자마자 브라우저 새로고침 없이 바로 반영되는 HMR(Hot Module Replacement)을 직접 확인했고, Vue Devtools를 설치해 컴포넌트 트리와 상태를 실시간으로 들여다보는 법도 익혔다. Devtools의 Components 탭에서 각 컴포넌트의 props/상태가 어떻게 표시되는지, Overview 탭에서 프로젝트 정보가 어떻게 요약되는지도 함께 살펴봤다.

### 1. Weather Mockup

정적 데이터로 서울, 용인, 부산, 제주, 춘천, 독도 6개 도시의 날씨를 카드 형태로 배치하는 것으로 시작했다. 도시 데이터는 `id`, `name`, `temp`, `status`를 갖는 객체 배열로 만들고, `v-for`와 `:key="city.id"`로 카드를 그리드(`grid-template-columns: repeat(3, 1fr)`)에 렌더링했다.

완성하고 보니 카드 묶음이 화면 중앙이 아니라 왼쪽으로 쏠려 보이는 문제가 있었다. 원인을 찾아보니 Vue 기본 스캐폴드의 `#app` 스타일이 1024px 이상 화면에서 2단 그리드로 동작하고 있었고, 컴포넌트가 그 그리드의 첫 번째 칸에만 들어가면서 왼쪽으로 붙어버린 것이었다. 전역 스타일은 그대로 두고, 컴포넌트 자신을 감싸는 래퍼에 `display: flex; justify-content: center;`를 줘서 스스로 중앙에 오도록 처리했다.

### 2. Weather Composition

`ref`, `computed`, `watch`, `watchEffect` 등 Composition API를 활용해 검색 필터링, 선택된 도시 표시, 즐겨찾기 기능을 하나의 컴포넌트 안에서 구현했다. 검색어(`searchQuery`)를 기준으로 도시 목록을 걸러내는 `filteredWeatherList`를 computed로 만들었고, 선택된 도시 문구가 바뀔 때마다 `watch`로 콘솔에 이전/이후 값을 로그로 남겨 반응성 흐름을 직접 눈으로 확인했다. `watchEffect`는 별도 의존성 배열을 지정하지 않아도 내부에서 참조한 값(검색어)이 바뀔 때 자동으로 재실행된다는 점을 확인하는 용도로 썼다.

### 3. Weather Component

앞에서 만든 `WeatherComposition.vue`를 역할별로 나눴다. 상태와 로직을 갖는 `WeatherParent.vue`, 슬롯으로 내용을 감싸는 껍데기 역할의 `BaseDashboardCard.vue`, 검색 입력을 담당하는 `SearchBar.vue`, 도시 하나를 보여주는 `WeatherCard.vue`로 분리했고, 여기에 더해 즐겨찾기 버튼을 `FavoriteButton.vue`로 한 번 더 쪼갰다. `BaseDashboardCard`는 named slot이 아니라 기본 slot 하나로 검색창 영역과 카드 목록 영역에 각각 재사용했고, 자식 컴포넌트에서 발생한 이벤트(`select-card`, `click-detail`, `toggle-favorite`)는 props/emit으로만 주고받아 단방향 데이터 흐름을 지켰다.

이 과정에서 WeatherCard.vue에 남아있던 옛 별 버튼 스타일(`.star-btn` 등)이 새 컴포넌트로 옮겨졌는데도 지워지지 않고 남아있는 걸 발견해서 정리했다.

### 4. Weather Router

Vue Router로 화면을 페이지 단위로 나눴다. 홈(`WeatherHomeView`), 상세(`WeatherDetailView`, 동적 세그먼트 `:cityId` 사용), 소개(`WeatherAboutView`), 존재하지 않는 경로를 위한 404 페이지(`NotFoundView`, `/:pathMatch(.*)*` catch-all 라우트)까지 구성했고, 모든 라우트는 `component: () => import(...)` 형태의 지연 로딩으로 등록했다. catch-all 라우트는 반드시 배열 맨 마지막에 와야 다른 라우트를 가리지 않는다는 점도 확인했다. 추가로 평균 기온, 최고/최저 도시, 맑은 도시 수를 보여주는 통계 페이지(`WeatherStatsView`)를 직접 만들어 넣었다. 상세보기 버튼을 눌렀을 때 `window.alert()`로 정보를 띄우던 방식도 `useRouter()`를 이용한 실제 페이지 이동(`router.push`)으로 바꿨다.

라우터를 붙이고 나니 내비게이션 바가 가로가 아니라 화면 왼쪽에 세로로 길게 늘어진 채로 나타나는 문제가 있었다. Weather Mockup 때와 같은 원인이었다 — `App.vue`의 `<nav>`와 `<RouterView />`가 최상위에 나란히 있다 보니 `#app`의 2단 그리드가 이 둘을 각각 다른 칸으로 갈라놓은 것이다. 이번엔 원인을 빠르게 알아챌 수 있었고, 두 요소를 `<div class="app-shell">` 하나로 감싼 뒤 `grid-column: 1 / -1`을 줘서 해결했다.

### 5. Weather Store (Pinia)

`configStore.js`를 만들어 날씨 단위(섭씨/화씨) 상태를 store로 관리했다. 상태는 `unit`, 화면에 뿌릴 기호는 `unitSymbol` getter, 전환 로직은 `toggleUnit` action으로 구성했고, `use + 파일명 + Store` 네이밍 규칙(`useConfigStore`)을 그대로 따랐다. 이 store를 쓰는 `UnitToggler.vue`를 내비게이션 바 옆에 배치해 메인/상세 페이지의 `displayTemp` computed에서 섭씨↔화씨 변환에 반영했다.

여기에 더해 `favoriteStore.js`를 직접 설계해봤다. 그동안 즐겨찾기는 도시 하나만 저장할 수 있는 로컬 상태였는데, 이걸 Pinia store로 옮기면서 배열(`favoriteCities`) 구조로 바꿔 여러 도시를 동시에 즐겨찾기할 수 있게 확장했고, 특정 도시의 즐겨찾기 여부를 확인하는 `isFavorite`은 인자를 받는 함수를 반환하는 computed getter로 만들었다. Pinia는 특정 컴포넌트가 아니라 앱 전체가 공유하는 상태라서, Router 단계에서는 페이지를 옮기면 사라졌던 즐겨찾기 정보를 이제는 통계 페이지에서도 그대로 볼 수 있게 됐다.

### 6. Weather Axios

Axios로 OpenWeatherMap API를 붙여 실제 날씨 데이터를 가져오도록 바꿨다. 6개 도시를 `Promise.all`로 한 번에 병렬 조회했고, 독도는 도시명 검색이 되지 않아 위도/경도로 따로 요청했다. 여기에 더해 같은 OpenWeatherMap의 대기질(Air Pollution) API를, 앞서 받은 날씨 응답의 좌표(`coord`)를 그대로 재사용해 추가로 호출하고 대기질 지수(1~5)를 좋음/양호/보통/나쁨/매우나쁨 등급으로 매핑해 카드에 표시했다. 날씨와는 무관한 외부 API로 QuoteSlate(명언 API)를 하나 더 연동해 대시보드 상단에 문구를 띄웠다. API 키는 `.env`에 넣어 코드에는 직접 드러나지 않게 했다.

이 단계에서 꽤 오래 헤맸다. 키를 발급받았는데도 계속 401 에러가 났고, 처음엔 "키가 아직 활성화가 안 됐나 보다"고 생각했다. 그런데 팀원의 키로 바꿔서 테스트해보니 그 키로는 바로 됐고, 그제서야 문제가 키 자체가 아니라 프로젝트에 `.env` 파일을 아예 만들지 않아서 값이 `undefined`로 전달되고 있었다는 걸 알게 됐다. `.env`를 만들고 개발 서버를 재시작하니 바로 해결됐다. (Vite는 `.env`를 서버 시작 시점에만 읽기 때문에, 파일을 새로 만들거나 고친 뒤에는 반드시 재시작이 필요하다는 것도 이때 알게 됐다.)

### 7. Weather UI Library

외부 UI 라이브러리로 Element Plus를 골라 전반적으로 적용했다. 검색창은 `el-input`(clearable 옵션 포함)으로, 버튼은 `el-button`으로 바꿨고, 더움/선선함이나 미세먼지 등급 뱃지는 `el-tag`의 색상 타입(success/warning/danger)으로 표현했다. 도시를 클릭하거나 즐겨찾기를 누르면 `ElMessage`로 상단에 토스트 알림이 뜨도록 했고, 날씨 데이터를 불러오는 동안 보여주던 안내 문구도 `el-skeleton`/`el-skeleton-item`으로 바꿔 실제 카드와 비슷한 모양(제목/텍스트/버튼 자리)의 회색 뼈대가 먼저 보이도록 개선했다. 로딩 속도가 워낙 빨라 눈으로 확인하기 어려워서, Chrome DevTools의 Network 탭에서 Slow 3G로 스로틀링을 걸어 스켈레톤 화면이 실제로 나타나는지 확인했다.

### 8. Weather Deployment

배포 전에 `npm run lint`(oxlint + eslint --fix)로 코드를 점검해 남아있는 에러가 없는지 확인했고(0 warnings, 0 errors), API 키가 `.env`에만 있고 `.gitignore`로 Git에는 올라가지 않는 것도 다시 확인했다. `npm run build`로 빌드한 뒤, GitHub 저장소를 Vercel에 연동해 배포했다. `.env` 값은 GitHub에 없기 때문에, Vercel 프로젝트의 Environment Variables에 `VITE_OWM_API_KEY` 이름으로 키를 따로 등록해 배포된 사이트에서도 실제 데이터가 뜨도록 했다. 이후로는 main 브랜치에 push할 때마다 자동으로 재배포되도록 연결해뒀다.

배포 주소: <https://skala-vue-eight-xi.vercel.app>

---

## 배운 점

4일 동안 비전공자로서 Vue를 처음부터 익히면서, 문법을 따라 치는 것을 넘어 왜 이렇게 동작하는지를 이해하려고 했다. 그 과정에서 기억에 남는 것들을 정리해본다.

같은 유형의 문제를 두 번 겪으면서 원인을 훨씬 빨리 알아보게 됐다는 게 가장 크게 남는다. Mockup 단계의 카드 정렬 문제와 Router 단계의 내비게이션 바 문제는 겉으로는 완전히 다르게 보였지만 둘 다 `#app`의 반응형 그리드가 원인이었다. 처음엔 한참 헤맸는데, 두 번째는 스크린샷만 보고도 바로 감이 왔다.

Axios 단계의 401 에러는 짐작만으로 판단하면 안 된다는 걸 알려준 경험이었다. "키가 아직 활성화 안 됐나 보다"는 추측이 그럴듯했지만 실제 원인은 전혀 다른 곳(`.env` 파일 부재)에 있었다. 팀원 키로 바꿔서 테스트해보는 식으로 변수를 하나씩 줄여나가야 진짜 원인을 찾을 수 있다는 걸 몸으로 배웠다.

즐겨찾기 기능이 프로젝트 전체를 거치며 계속 진화한 것도 인상 깊다. 컴포넌트 안의 로컬 상태 하나였던 게, Router 단계에서는 페이지를 옮기면 사라지는 한계에 부딪혔고, Store 단계에 와서야 Pinia로 옮기면서 여러 도시를 담을 수 있는 구조로 바뀌었다. 예전에 "지금은 안 되는" 문제로 남겨뒀던 걸 나중에 배운 도구로 실제로 풀어낸 게 이번 실습에서 가장 뿌듯했던 부분이다.

반대로 UI 라이브러리 적용이나 배포 과정에서는, 안내를 따라가며 환경 변수·빌드·정적 호스팅 같은 개념을 하나씩 처음 접했고 아직 스스로 처음부터 설계할 수 있을 만큼 익숙하진 않다. 다음엔 문제를 마주쳤을 때 바로 물어보기 전에 원인을 좀 더 스스로 좁혀보는 시도를 해보고 싶다.

---

## Code Challenge 연습

수업 중 연습한 Code Challenge들은 `src/components/practices/basic/SampleOne.vue`, `SampleTwo.vue` 두 파일에 정리했습니다.
