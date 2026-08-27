<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import BaseDashboardCard from '../components/practices/weather/BaseDashboardCard.vue'
import SearchBar from '../components/practices/weather/SearchBar.vue'
import WeatherCard from '../components/practices/weather/WeatherCard.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

// ────────────────────────────────────────────
// 1. useRouter - 스크립트 안에서 페이지를 이동시키는 라우터 인스턴스를 가져옴
// ────────────────────────────────────────────
const router = useRouter()

// ────────────────────────────────────────────
// 2. OpenWeatherMap 연동 준비
//    - API 키는 .env의 VITE_OWM_API_KEY에서 불러옴 (코드에 키를 직접 적지 않음)
//    - 도시별 조회 파라미터를 미리 정의 (독도는 이름 검색이 안 돼서 위도/경도로 조회)
// ────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_OWM_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityQueryMap = {
  city_01: { name: '서울', params: { q: 'Seoul,KR' } },
  city_02: { name: '용인', params: { q: 'Yongin,KR' } },
  city_03: { name: '부산', params: { q: 'Busan,KR' } },
  city_04: { name: '제주', params: { q: 'Jeju,KR' } },
  city_05: { name: '춘천', params: { q: 'Chuncheon,KR' } },
  city_06: { name: '독도', params: { lat: 37.2426, lon: 131.8661 } },
}

// ────────────────────────────────────────────
// 3. 요구사항 2: 대기질 지수(1~5) 숫자를 한글 등급/스타일 클래스로 매핑하는 사전
//    - OpenWeatherMap Air Pollution API는 aqi를 1~5 숫자로만 줌
// ────────────────────────────────────────────
const AQI_LABELS = {
  1: { text: '좋음', className: 'aqi-good' },
  2: { text: '양호', className: 'aqi-fair' },
  3: { text: '보통', className: 'aqi-moderate' },
  4: { text: '나쁨', className: 'aqi-poor' },
  5: { text: '매우나쁨', className: 'aqi-very-poor' },
}

const weatherList = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedCityInfo = ref('')

// ────────────────────────────────────────────
// 4. 요구사항 1+2: 6개 도시 날씨(1차) + 대기질(2차)을 순서대로 병렬 조회해서 weatherList 채움
//    - 1차: 날씨 API 응답에서 좌표(coord)를 얻음
//    - 2차: 그 좌표로 대기질 API를 추가 호출 (같은 도시니까 좌표 재사용)
// ────────────────────────────────────────────
const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    const entries = Object.entries(cityQueryMap)
    const responses = await Promise.all(
      entries.map(([, city]) =>
        axios.get(BASE_URL, {
          params: { ...city.params, appid: API_KEY, units: 'metric', lang: 'kr' },
        }),
      ),
    )

    const airResponses = await Promise.all(
      responses.map((res) =>
        axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
          params: { lat: res.data.coord.lat, lon: res.data.coord.lon, appid: API_KEY },
        }),
      ),
    )

    weatherList.value = entries.map(([id, city], index) => {
      const data = responses[index].data
      const aqi = airResponses[index].data.list[0].main.aqi
      return {
        id,
        name: city.name,
        temp: data.main.temp,
        status: data.weather[0].description,
        aqi,
        aqiLabel: AQI_LABELS[aqi]?.text ?? '알수없음',
        aqiClass: AQI_LABELS[aqi]?.className ?? '',
      }
    })
  } catch (error) {
    console.error('🔴 날씨/대기질 API 연동 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// ────────────────────────────────────────────
// 5. 요구사항 3: OpenWeatherMap이 아닌 "기타 외부 API" - QuoteSlate(명언 API)
//    - 키 발급/가입 없이 바로 호출 가능한 공개 API
//    - 날씨 데이터와 별개로 독립적인 상태(quote)로 관리
// ────────────────────────────────────────────
const quote = ref(null)
const isQuoteLoading = ref(false)

const fetchQuote = async () => {
  isQuoteLoading.value = true
  try {
    const response = await axios.get('https://quoteslate.vercel.app/api/quotes/random')
    quote.value = response.data
  } catch (error) {
    console.error('🔴 명언 API 연동 실패:', error)
  } finally {
    isQuoteLoading.value = false
  }
}

// ────────────────────────────────────────────
// 6. 컴포넌트 장착 직후 날씨/대기질 + 명언을 동시에 가동
// ────────────────────────────────────────────
onMounted(() => {
  fetchRealTimeWeather()
  fetchQuote()
})

const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})

watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[watch] 상태바 문구 변경: "${oldVal}" -> "${newVal}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// ────────────────────────────────────────────
// 7. window.alert() 대신 Programmatic Navigation
// ────────────────────────────────────────────
function handleDetailJump(cityId) {
  router.push('/weather/' + cityId)
}

// ────────────────────────────────────────────
// 8. 즐겨찾기 기능 - favoriteStore(Pinia)로 관리
//    - Pinia store라서 이 페이지를 벗어나도(예: /stats로 이동) 값이 유지됨
// ────────────────────────────────────────────
const favoriteStore = useFavoriteStore()

const favoriteCityDetails = computed(() => {
  return weatherList.value.filter((city) => favoriteStore.isFavorite(city.name))
})

watch(
  () => favoriteStore.favoriteCities.length,
  (newVal) => {
    console.log(`[watch] 즐겨찾기 도시 개수가 ${newVal}개로 변경되었습니다.`)
  },
)
</script>

<template>
  <div class="weather-mockup">
    <div class="weather-box">
      <h2 class="page-title">🌦️ 오늘의 날씨</h2>

      <!-- 요구사항 3: 명언 배너 -->
      <p v-if="quote" class="quote-banner">💬 "{{ quote.quote }}" — {{ quote.author }}</p>

      <BaseDashboardCard>
        <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
      </BaseDashboardCard>

      <!-- 즐겨찾기 도시가 여러 개일 수 있으니 v-for로 나열 -->
      <p v-for="city in favoriteCityDetails" :key="city.id" class="favorite-banner">
        ⭐ 즐겨찾기: {{ city.name }} ({{ city.temp }}°, {{ city.status }})
      </p>

      <p class="status-bar" :class="{ 'status-active': selectedCityInfo }">
        {{ selectedCityInfo || '카드를 클릭하면 여기에 표시돼요' }}
      </p>

      <BaseDashboardCard>
        <p v-if="isLoading" class="loading-msg">🔄 실시간 날씨 데이터를 가져오는 중입니다...</p>
        <div v-else-if="filteredWeatherList.length > 0" class="card-grid">
          <!-- is-favorite / toggle-favorite 모두 favoriteStore 기준 -->
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city-item="city"
            :is-favorite="favoriteStore.isFavorite(city.name)"
            @select-card="selectCity"
            @click-detail="handleDetailJump"
            @toggle-favorite="favoriteStore.toggleFavorite"
          />
        </div>
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
.quote-banner {
  margin: 0 0 14px;
  padding: 10px 14px;
  background: #eef6ff;
  border-radius: 10px;
  font-size: 13px;
  font-style: italic;
  color: #2c5282;
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
.loading-msg {
  text-align: center;
  color: #3498db;
  font-weight: bold;
  padding: 20px 0;
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
