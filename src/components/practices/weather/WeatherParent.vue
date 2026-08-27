<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// ────────────────────────────────────────────
// 1. 반응형 상태 - 이 앱의 모든 데이터를 여기 WeatherParent가 "본부"로서 갖고 있음
//    - 4개 컴포넌트로 쪼개졌어도, 실제 데이터와 로직은 전부 여기에 모아둠(단일 진실 공급원)
//    - 자식 컴포넌트들(BaseDashboardCard/SearchBar/WeatherCard)은 데이터를 직접 안 갖고
//      props로 받아서 "보여주기"만 담당함
// ────────────────────────────────────────────
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '용인', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '흐림' },
  { id: 'city_05', name: '춘천', temp: 23, status: '맑음' },
  { id: 'city_06', name: '독도', temp: 25, status: '바람' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('')

// ────────────────────────────────────────────
// 2. computed - searchQuery나 weatherList가 바뀔 때만 자동으로 다시 계산되는 필터링 결과
// ────────────────────────────────────────────
const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})

// ────────────────────────────────────────────
// 3. watch / watchEffect - 값의 변화를 감시해서 로그를 남김 (Composition 단계 그대로 유지)
// ────────────────────────────────────────────
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[watch] 상태바 문구 변경: "${oldVal}" -> "${newVal}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// ────────────────────────────────────────────
// 4. 자식 컴포넌트가 emit한 이벤트를 받아서 실행할 함수들
//    - selectCity: WeatherCard의 select-card 이벤트를 받아서 상태바 문구 갱신
//    - showDetail: WeatherCard의 click-detail 이벤트를 받아서 알림창 표시
//      (아직 Router 적용 전 단계라 여기선 alert. Weather Router 단계에서 router.push로 교체됨)
// ────────────────────────────────────────────
function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}
function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// ────────────────────────────────────────────
// 5. 본인만의 반응형 상태(즐겨찾기) - Weather Composition 단계에서 추가했던 기능 그대로 유지
//    - favoriteCity: 찜한 도시 이름 하나만 저장
//    - favoriteCityDetail: 그 이름에 해당하는 도시 상세 정보를 weatherList에서 자동 조회(computed)
//    - toggleFavorite: WeatherCard(내부 FavoriteButton)의 toggle-favorite 이벤트를 받아서 실행
// ────────────────────────────────────────────
const favoriteCity = ref(null)
const favoriteCityDetail = computed(() => {
  return weatherList.value.find((city) => city.name === favoriteCity.value)
})
watch(favoriteCity, (newVal) => {
  console.log(`[watch] 즐겨찾기 도시가 "${newVal}"(으)로 변경되었습니다.`)
})
function toggleFavorite(cityName) {
  favoriteCity.value = favoriteCity.value === cityName ? null : cityName
}
</script>

<template>
  <div class="weather-mockup">
    <div class="weather-box">
      <h2 class="page-title">🌦️ 오늘의 날씨</h2>

      <!-- 6. BaseDashboardCard는 이름 있는 슬롯(named slot) 없이
           그냥 "카드 껍데기" 하나를 두 번 재사용하는 방식으로 씀
           (검색창 영역 한 번, 도시 목록 영역 한 번 - 디자인 공통화) -->
      <BaseDashboardCard>
        <!-- 7. SearchBar: 검색어(props)를 내려주고, 타이핑하면 update-query(emit)를 받아
             부모(WeatherParent)의 searchQuery를 직접 갱신함 (v-model을 손수 풀어쓴 것과 같음) -->
        <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
      </BaseDashboardCard>

      <!-- 8. 즐겨찾기 도시가 있을 때만 상단에 요약 배너 표시 (v-if) -->
      <p v-if="favoriteCityDetail" class="favorite-banner">
        ⭐ 즐겨찾기: {{ favoriteCityDetail.name }} ({{ favoriteCityDetail.temp }}°,
        {{ favoriteCityDetail.status }})
      </p>

      <p class="status-bar" :class="{ 'status-active': selectedCityInfo }">
        {{ selectedCityInfo || '카드를 클릭하면 여기에 표시돼요' }}
      </p>

      <BaseDashboardCard>
        <!-- 9. filteredWeatherList를 v-for로 순회하며 WeatherCard를 각 도시마다 하나씩 렌더링
             - :city-item, :is-favorite로 데이터를 내려주고(props)
             - @select-card, @click-detail, @toggle-favorite로 자식의 이벤트를 받음(emits) -->
        <div v-if="filteredWeatherList.length > 0" class="card-grid">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city-item="city"
            :is-favorite="favoriteCity === city.name"
            @select-card="selectCity"
            @click-detail="showDetail"
            @toggle-favorite="toggleFavorite"
          />
        </div>
        <!-- 10. 검색 결과가 하나도 없을 때 안내 문구 표시 (v-else) -->
        <p v-else class="no-result">"{{ searchQuery }}"와(과) 일치하는 도시가 없습니다.</p>
      </BaseDashboardCard>
    </div>
  </div>
</template>

<style scoped>
.weather-mockup {
  display: flex;
  justify-content: center;
  width: 100%;
}
.weather-box {
  max-width: 640px;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  background-color: #fff8dc;
  border-radius: 28px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
.page-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #1f3a5f;
}
.favorite-banner {
  margin: 10px 2px 0;
  font-size: 13px;
  color: #b8860b;
  font-weight: bold;
}
.status-bar {
  margin: 14px 0 20px;
  padding: 10px 14px;
  background: #ffffffaa;
  border-radius: 10px;
  font-size: 13px;
  color: #888;
  transition: all 0.2s;
}
.status-active {
  background: #eaf1fe;
  color: #2f6fed;
  font-weight: bold;
}
.no-result {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
</style>
