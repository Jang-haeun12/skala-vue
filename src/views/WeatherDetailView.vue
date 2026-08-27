<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// 임시 Mock Data (실제 서버 데이터라고 가정)
const mockDetails = {
  city_01: { name: '서울', temp: 28, status: '맑음', humidity: '55%', wind: '2.1m/s' },
  city_02: { name: '용인', temp: 24, status: '비', humidity: '80%', wind: '3.4m/s' },
  city_03: { name: '부산', temp: 26, status: '구름', humidity: '65%', wind: '4.0m/s' },
  city_04: { name: '제주', temp: 22, status: '흐림', humidity: '70%', wind: '5.2m/s' },
  city_05: { name: '춘천', temp: 23, status: '맑음', humidity: '50%', wind: '1.8m/s' },
  city_06: { name: '독도', temp: 25, status: '바람', humidity: '60%', wind: '6.5m/s' },
}

const cityData = ref(null)

// Mount 시점에 라우트 파라미터(cityId)로 Mock Data에서 도시 하나를 골라옴
onMounted(() => {
  const id = route.params.cityId
  cityData.value = mockDetails[id] || null
})

// ────────────────────────────────────────────
// cityData가 null일 수도 있으니(아직 못 찾은 도시) 방어 코드 포함
// 원본은 섭씨로 고정, configStore.unit에 따라 화씨로 변환해서 보여줌
// ────────────────────────────────────────────
const displayTemp = computed(() => {
  if (!cityData.value) return null
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="detail-box">
    <h2>📊 지역별 상세 기상 관측 정보</h2>

    <div v-if="cityData" class="info-card">
      <h3>{{ cityData.name }}</h3>
      <p>
        기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>날씨 상태: {{ cityData.status }}</p>
      <p>습도: {{ cityData.humidity }}</p>
      <p>풍속: {{ cityData.wind }}</p>
    </div>
    <p v-else class="not-found-msg">해당 도시의 상세 정보를 찾을 수 없어요.</p>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-box {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 16px;
  border-radius: 10px;
  margin: 16px 0;
}
.not-found-msg {
  color: #999;
  padding: 20px 0;
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
