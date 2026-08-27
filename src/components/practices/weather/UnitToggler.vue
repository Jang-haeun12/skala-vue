<script setup>
// ────────────────────────────────────────────
// 1. configStore 불러오기
//    useConfigStore()를 호출하면 store 인스턴스를 받아옴
//    이 인스턴스를 통해 state/getters/actions에 모두 접근 가능
// ────────────────────────────────────────────
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <!-- ────────────────────────────────────────────
         2. 현재 단위 표시
            configStore.unit 값을 직접 참조 → store 상태가
            바뀌면 화면도 자동으로 다시 렌더링됨 (반응성)
    ──────────────────────────────────────────── -->
    <span>
      날씨단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
    </span>

    <!-- ────────────────────────────────────────────
         3. 단위 변경 버튼
            클릭 시 configStore의 toggleUnit 액션을 바로 호출
            (별도 emit 없이 store action을 직접 실행)
    ──────────────────────────────────────────── -->
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  color: white;
}
.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
</style>
