<script setup>
import { RouterLink, RouterView } from 'vue-router'
// ────────────────────────────────────────────
// 1. UnitToggler 컴포넌트 불러오기
//    이 컴포넌트 안에서 configStore를 직접 참조하므로
//    App.vue 쪽에서는 props/emit 없이 그냥 배치만 하면 됨
// ────────────────────────────────────────────
import UnitToggler from './components/practices/weather/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <nav class="nav-bar">
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/about">소개</RouterLink>
      <RouterLink to="/stats">통계</RouterLink>

      <!-- ────────────────────────────────────────────
           2. Navigation Bar 옆에 배치
              UnitToggler 자체 스타일에 margin-left:auto가
              있어서 nav-bar 안에서 오른쪽 끝으로 밀려남
      ──────────────────────────────────────────── -->
      <UnitToggler />
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  grid-column: 1 / -1;
}
.nav-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  background: #1f3a5f;
}
.nav-bar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
.nav-bar a.router-link-active {
  color: #f5b301;
}
</style>
