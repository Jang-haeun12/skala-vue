<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore'

const router = useRouter()

// ────────────────────────────────────────────
// 1. 독립적인 mock 데이터 (WeatherHomeView와 같은 도시 목록을 그대로 복사해서 사용)
//    - weatherList 자체는 여전히 이 파일 안에 독립적으로 둔 mock 데이터임
//    - 다만 "즐겨찾기 여부"는 favoriteStore(Pinia)가 앱 전체에서 공유되기 때문에
//      이제는 이 페이지에서도 홈 화면과 동일한 즐겨찾기 상태를 그대로 읽어올 수 있음
// ────────────────────────────────────────────
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '용인', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '흐림' },
  { id: 'city_05', name: '춘천', temp: 23, status: '맑음' },
  { id: 'city_06', name: '독도', temp: 25, status: '바람' },
])

// ────────────────────────────────────────────
// 2. computed 4종 - weatherList를 기반으로 자동 계산되는 통계값들
// ────────────────────────────────────────────
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

const hottestCity = computed(() =>
  weatherList.value.reduce((max, city) => (city.temp > max.temp ? city : max)),
)

const coldestCity = computed(() =>
  weatherList.value.reduce((min, city) => (city.temp < min.temp ? city : min)),
)

const sunnyCount = computed(() => weatherList.value.filter((city) => city.status === '맑음').length)

// ────────────────────────────────────────────
// 3. favoriteStore 연결 - 요구사항 4(본인만의 추가 Store 활용)를 이 페이지에서도 보여주는 부분
//    - 홈 화면(WeatherHomeView)에서 별 눌러놓은 도시들을 이 통계 페이지에서도 그대로 확인 가능
//    - 이 페이지를 새로고침 없이 오갔을 때 값이 유지되는 게 Pinia store를 쓴 효과
// ────────────────────────────────────────────
const favoriteStore = useFavoriteStore()
const favoriteCities = computed(() => {
  return weatherList.value.filter((city) => favoriteStore.isFavorite(city.name))
})
</script>

<template>
  <div class="stats-box">
    <h2>📈 오늘의 날씨 통계</h2>

    <div class="stat-row">
      <div class="stat-card">
        <p class="stat-label">평균 기온</p>
        <p class="stat-value">{{ averageTemp }}°</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">가장 더운 도시</p>
        <p class="stat-value">{{ hottestCity.name }} ({{ hottestCity.temp }}°)</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">가장 선선한 도시</p>
        <p class="stat-value">{{ coldestCity.name }} ({{ coldestCity.temp }}°)</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">맑은 도시 수</p>
        <p class="stat-value">{{ sunnyCount }}곳</p>
      </div>
    </div>

    <!-- 4. 즐겨찾기 목록 섹션 - favoriteStore가 앱 전체 공유 상태이기 때문에
         홈 화면에서 누른 즐겨찾기가 그대로 반영됨 -->
    <div class="favorite-section">
      <h3>⭐ 즐겨찾기 도시</h3>
      <ul v-if="favoriteCities.length > 0" class="favorite-list">
        <li v-for="city in favoriteCities" :key="city.id">
          {{ city.name }} ({{ city.temp }}°, {{ city.status }})
        </li>
      </ul>
      <p v-else class="no-favorite">아직 즐겨찾기한 도시가 없어요. 홈 화면에서 별을 눌러보세요.</p>
    </div>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.stats-box {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.stat-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
}
.stat-card {
  background: #eaf1fe;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}
.stat-label {
  font-size: 12px;
  color: #888;
  margin: 0 0 6px;
}
.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #2f6fed;
  margin: 0;
}
.favorite-section {
  margin: 16px 0;
  padding: 14px;
  background: #fff8e1;
  border-radius: 10px;
}
.favorite-section h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #b8860b;
}
.favorite-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #555;
}
.favorite-list li {
  margin-bottom: 4px;
}
.no-favorite {
  margin: 0;
  font-size: 13px;
  color: #999;
}
.back-btn {
  margin-top: 8px;
  padding: 10px 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
