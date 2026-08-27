<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// ────────────────────────────────────────────
// 1. 반응형 상태 3종 (1일차와 동일한 데이터 구조)
//p.145 Hands on - Weather Composition
// ────────────────────────────────────────────
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '용인', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '흐림' },
  { id: 'city_05', name: '춘천', temp: 23, status: '맑음' },
  { id: 'city_06', name: '독도', temp: 25, status: '바람' },
])

const searchQuery = ref('') // 검색어
const selectedCityInfo = ref('') // 선택된 도시의 상태바 문구

// ────────────────────────────────────────────
// 2. computed: 검색어가 도시 이름에 포함된 항목만 걸러낸 배열
//    - weatherList나 searchQuery 둘 중 하나라도 바뀌면 자동으로 다시 계산됨
//    - computed는 "값"처럼 쓰는 함수라서, 매번 새로 필터링하지 않고 캐싱해서 효율적임
// ────────────────────────────────────────────
const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})

// ────────────────────────────────────────────
// 3-1. watch: selectedCityInfo "이전 값 -> 새 값"의 변화를 감시
//    - 감시 대상을 명확히 지정(selectedCityInfo)하고, 콜백에서 newVal/oldVal을 둘 다 받을 수 있음
// ────────────────────────────────────────────
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[watch] 상태바 문구 변경: "${oldVal}" -> "${newVal}"`)
})

// ────────────────────────────────────────────
// 3-2. watchEffect: 함수 안에서 "사용한" 반응형 값을 자동으로 추적
//    - searchQuery.value를 읽는 순간 자동으로 감시 대상에 등록됨
//    - 컴포넌트가 생성될 때 1회 즉시 실행 + 이후 searchQuery가 바뀔 때마다 실행
// ────────────────────────────────────────────
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// 카드 클릭 시 상태바 문구 갱신
function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// ────────────────────────────────────────────
// 5. 본인만의 반응형 상태 + computed + watcher 추가
//    - favoriteCity(상태): 즐겨찾기로 찜한 도시 이름
//    - favoriteCityDetail(computed): 그 이름에 해당하는 도시 상세 정보 자동 조회
//    - watch(favoriteCity, ...): 즐겨찾기가 바뀔 때마다 로그 기록
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

      <input
        type="text"
        class="search-box"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="도시 이름을 입력하세요"
      />

      <!-- 5. 즐겨찾기 도시가 있으면 상단에 요약 배너로 표시 -->
      <p v-if="favoriteCityDetail" class="favorite-banner">
        ⭐ 즐겨찾기: {{ favoriteCityDetail.name }} ({{ favoriteCityDetail.temp }}°,
        {{ favoriteCityDetail.status }})
      </p>

      <p class="status-bar" :class="{ 'status-active': selectedCityInfo }">
        {{ selectedCityInfo || '카드를 클릭하면 여기에 표시돼요' }}
      </p>

      <!-- 4. 검색 결과 표시 로직 -->
      <!-- 4-1. 검색어가 비어있으면 원본 weatherList 전체 출력 -->
      <div v-if="searchQuery === ''" class="card-grid">
        <div
          v-for="city in weatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city.name)"
        >
          <div class="card-top">
            <h3 class="city-name">{{ city.name }}</h3>
            <span class="temp">{{ city.temp }}°</span>
          </div>
          <p class="city-status">{{ city.status }}</p>
          <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge badge-cool">❄️ 선선함 (25도 미만)</span>
          <div class="btn-row">
            <button
              class="star-btn"
              :class="{ starred: favoriteCity === city.name }"
              @click.stop="toggleFavorite(city.name)"
            >
              ★
            </button>
            <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
              상세보기
            </button>
          </div>
        </div>
      </div>

      <!-- 4-2. 검색어가 있고, 일치하는 결과가 있으면 filteredWeatherList 출력 -->
      <div v-else-if="filteredWeatherList.length > 0" class="card-grid">
        <div
          v-for="city in filteredWeatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city.name)"
        >
          <div class="card-top">
            <h3 class="city-name">{{ city.name }}</h3>
            <span class="temp">{{ city.temp }}°</span>
          </div>
          <p class="city-status">{{ city.status }}</p>
          <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge badge-cool">❄️ 선선함 (25도 미만)</span>
          <div class="btn-row">
            <button
              class="star-btn"
              :class="{ starred: favoriteCity === city.name }"
              @click.stop="toggleFavorite(city.name)"
            >
              ★
            </button>
            <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
              상세보기
            </button>
          </div>
        </div>
      </div>

      <!-- 4-3. 검색어는 있는데 일치하는 결과가 없으면 안내 문구 -->
      <p v-else class="no-result">"{{ searchQuery }}"와(과) 일치하는 도시가 없습니다.</p>
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
.search-box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #d5dbe3;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}
.search-box:focus {
  border-color: #2f6fed;
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
.weather-card {
  background: white;
  border: 1px solid #eaeef3;
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.weather-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.city-name {
  margin: 0;
  font-size: 17px;
}
.temp {
  font-size: 20px;
  font-weight: bold;
  color: #2f6fed;
}
.city-status {
  margin: 4px 0 10px;
  font-size: 13px;
  color: #888;
}
.badge {
  display: inline-block;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.badge-hot {
  background: #ffe8e0;
  color: #d64c2e;
}
.badge-cool {
  background: #e5f3ff;
  color: #1c7ed6;
}
.btn-row {
  display: flex;
  gap: 6px;
}
.star-btn {
  border: 1px solid #eee;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #ccc;
  font-size: 14px;
  padding: 0 10px;
}
.star-btn.starred {
  color: #f5b301;
  border-color: #f5b301;
}
.detail-btn {
  flex: 1;
  padding: 8px 0;
  background: #2f6fed;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
}
.detail-btn:hover {
  background: #1f5bd0;
}
</style>
