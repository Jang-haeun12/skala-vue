import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ────────────────────────────────────────────
// 즐겨찾기 도시 목록을 관리하는 Store
// - configStore와 달리, 이건 이 핸즈온에서 새로 직접 설계한 "본인만의 Store"임
// ────────────────────────────────────────────
export const useFavoriteStore = defineStore('favorite', () => {
  // ────────────────────────────────────────────
  // 1. state: 즐겨찾기된 도시 "이름들"을 배열로 저장
  //    (기존 로컬 state는 도시 1개만 저장했지만, 여기선 여러 개 담기게 배열로 설계)
  // ────────────────────────────────────────────
  const favoriteCities = ref([])

  // ────────────────────────────────────────────
  // 2. getters: 특정 도시가 지금 즐겨찾기 상태인지 확인
  //    - computed가 함수를 반환하는 형태 → isFavorite('서울') 처럼 인자를 받아서 씀
  //    - favoriteCities 배열이 바뀌면 이 getter도 자동으로 최신 상태 반영
  // ────────────────────────────────────────────
  const isFavorite = computed(() => (cityName) => favoriteCities.value.includes(cityName))

  // ────────────────────────────────────────────
  // 3. actions: 이미 즐겨찾기 되어있으면 배열에서 제거(취소),
  //    안 되어있으면 배열에 추가(즐겨찾기)
  // ────────────────────────────────────────────
  function toggleFavorite(cityName) {
    const idx = favoriteCities.value.indexOf(cityName)
    if (idx === -1) {
      favoriteCities.value.push(cityName)
    } else {
      favoriteCities.value.splice(idx, 1)
    }
  }

  // ────────────────────────────────────────────
  // 4. 외부(컴포넌트)에서 쓸 수 있게 반환
  // ────────────────────────────────────────────
  return { favoriteCities, isFavorite, toggleFavorite }
})
