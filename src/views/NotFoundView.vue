<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h2>404</h2>
    <p>요청하신 페이지를 찾을 수 없어요.</p>
    <button @click="router.push('/')">메인으로 돌아가기</button>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 20px;
}
button {
  margin-top: 16px;
  padding: 10px 20px;
  background: #2f6fed;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
