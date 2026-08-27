<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import FavoriteButton from './FavoriteButton.vue'

// ────────────────────────────────────────────
// 1. Props - 부모(WeatherHomeView)로부터 "도시 하나의 데이터"와 "즐겨찾기 여부"를 전달받음
//    - cityItem: 도시 객체 전체 (id, name, temp, status, aqi, aqiLabel, aqiClass)
//    - isFavorite: 지금 이 도시가 즐겨찾기로 선택된 도시인지 (boolean)
//    - displayTemp에서 props.cityItem.temp를 참조해야 해서 변수로 받아둠
// ────────────────────────────────────────────
const props = defineProps({
  cityItem: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
})

// ────────────────────────────────────────────
// 2. Emits - 이 컴포넌트 안에서 일어난 일을 부모에게 이벤트로 "올려보냄"
// ────────────────────────────────────────────
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

// ────────────────────────────────────────────
// 3. configStore 연결 + 화면에 뿌릴 온도 계산
//    - 원본 데이터(cityItem.temp)는 항상 섭씨 숫자로 고정
//    - configStore.unit이 fahrenheit면 그때그때 변환해서 보여줌
//    - 실제 API는 소수점 온도를 주므로 Math.round로 반올림
// ────────────────────────────────────────────
const configStore = useConfigStore()
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp)
})
</script>

<template>
  <div class="weather-card" @click="emit('select-card', cityItem.name)">
    <div class="card-top">
      <h3 class="city-name">{{ cityItem.name }}</h3>
      <span class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
    </div>
    <p class="city-status">{{ cityItem.status }}</p>

    <!-- 더움/선선함 판정은 원본 섭씨 기준(cityItem.temp) 그대로 유지 -->
    <span v-if="cityItem.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge badge-cool">❄️ 선선함 (25도 미만)</span>

    <!-- 4. 요구사항 2: 대기질(미세먼지) 뱃지 - OpenWeatherMap Air Pollution API 결과 -->
    <span v-if="cityItem.aqiLabel" class="badge" :class="cityItem.aqiClass">
      🌫️ 미세먼지: {{ cityItem.aqiLabel }}
    </span>

    <div class="btn-row">
      <!-- 5. 즐겨찾기 버튼은 FavoriteButton으로 따로 분리한 컴포넌트 -->
      <FavoriteButton :is-favorite="isFavorite" @toggle="emit('toggle-favorite', cityItem.name)" />
      <button class="detail-btn" @click.stop="emit('click-detail', cityItem.id)">상세보기</button>
    </div>
  </div>
</template>

<style scoped>
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
  margin-bottom: 8px;
  margin-right: 4px;
}
.badge-hot {
  background: #ffe8e0;
  color: #d64c2e;
}
.badge-cool {
  background: #e5f3ff;
  color: #1c7ed6;
}
.aqi-good {
  background: #e3f9e5;
  color: #1e8e3e;
}
.aqi-fair {
  background: #eaf7e0;
  color: #4b9e3e;
}
.aqi-moderate {
  background: #fff8e0;
  color: #b8860b;
}
.aqi-poor {
  background: #ffe8d6;
  color: #d2691e;
}
.aqi-very-poor {
  background: #ffe0e0;
  color: #c0392b;
}
.btn-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
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
