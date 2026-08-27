<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  cityItem: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const configStore = useConfigStore()
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp)
})

// ────────────────────────────────────────────
// UI Library 적용: 더움/선선함, 미세먼지 뱃지를 el-tag의 type(색상)으로 매핑
//    - el-tag는 색상 조합을 직접 만들 필요 없이 type만 지정하면 됨
// ────────────────────────────────────────────
const aqiTagType = computed(() => {
  const aqi = props.cityItem.aqi
  if (!aqi) return 'info'
  if (aqi <= 2) return 'success'
  if (aqi === 3) return 'warning'
  return 'danger'
})
</script>

<template>
  <div class="weather-card" @click="emit('select-card', cityItem.name)">
    <div class="card-top">
      <h3 class="city-name">{{ cityItem.name }}</h3>
      <span class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
    </div>
    <p class="city-status">{{ cityItem.status }}</p>

    <div class="tag-row">
      <el-tag :type="cityItem.temp >= 25 ? 'danger' : 'primary'" effect="light" size="small">
        {{ cityItem.temp >= 25 ? '🔥 더움 (25도 이상)' : '❄️ 선선함 (25도 미만)' }}
      </el-tag>

      <el-tag v-if="cityItem.aqiLabel" :type="aqiTagType" effect="light" size="small">
        🌫️ 미세먼지: {{ cityItem.aqiLabel }}
      </el-tag>
    </div>

    <div class="btn-row">
      <FavoriteButton :is-favorite="isFavorite" @toggle="emit('toggle-favorite', cityItem.name)" />
      <el-button type="primary" size="small" @click.stop="emit('click-detail', cityItem.id)">
        상세보기
      </el-button>
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
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.btn-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-row .el-button {
  flex: 1;
}
</style>
