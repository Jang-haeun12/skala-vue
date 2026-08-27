<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="about-box">
    <h2>🌦️ 오늘의 날씨 서비스 소개</h2>
    <p>
      이 앱은 Vue 3 Composition API와 Vue Router로 만든 날씨 대시보드예요. 도시를 검색하고,
      즐겨찾기로 등록하고, 상세 페이지에서 자세한 기상 정보를 확인할 수 있어요.
    </p>
    <ul>
      <li>WeatherHomeView - 도시 검색 및 목록 화면</li>
      <li>WeatherDetailView - 도시별 상세 기상 정보</li>
      <li>컴포넌트 분리(BaseDashboardCard, SearchBar, WeatherCard, FavoriteButton)로 구성</li>
    </ul>
    <button class="home-btn" @click="router.push('/')">메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.about-box {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  background-color: #fff8dc;
  border-radius: 20px;
}
.about-box ul {
  margin: 12px 0;
  padding-left: 20px;
  color: #555;
  font-size: 14px;
}
.home-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: #2f6fed;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
</style>
