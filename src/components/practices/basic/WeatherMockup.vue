<script setup>
// ref: 값이 바뀌면 화면도 자동으로 다시 그려주는 반응형 변수를 만드는 함수
// p.116의 hands on - weather mock up 만듦
import { ref } from 'vue'

// ────────────────────────────────────────────
// 1. 날씨 목데이터 배열 (요구사항 1번)
//    - ref([...])로 감싸서 "배열 자체"를 반응형으로 만듦
//    - 배열 안 각 항목은 도시 하나를 나타내는 객체
//    - id는 v-for에서 :key로 쓰기 위한 고유 식별자 (요구사항 1번 필수조건)
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
// 3. 검색 입력창과 연결되는 반응형 변수 (요구사항 3번)
//    - 처음엔 빈 문자열('')로 시작
//    - input에 :value로 "현재 값"을 보여주고, @input으로 "입력이 생길 때마다" 이 변수를 갱신
//    - v-model 대신 :value + @input을 직접 쓴 이유: 한글은 조합 중간 상태(ㅎ->하->한)가
//      있어서, 이렇게 풀어 쓰면 그 과정이 어떻게 처리되는지 원리를 직접 확인할 수 있음
// ────────────────────────────────────────────
const searchKeyword = ref('')

// ────────────────────────────────────────────
// 4. 카드를 클릭했을 때 상태바에 표시할 메시지 (요구사항 4번)
// ────────────────────────────────────────────
const selectedMessage = ref('')

// 카드(배경) 클릭 시 실행되는 함수 - 상태바 문구를 바꿔줌
function selectCity(cityName) {
  selectedMessage.value = `${cityName}이 선택되었습니다.`
}

// [상세보기] 버튼 클릭 시 실행되는 함수 - alert 창만 띄우고 상태바는 건드리지 않음
// (템플릿에서 @click.stop을 써서, 이 클릭이 부모(카드)의 클릭 이벤트로 안 튀게 막음 = 버블링 방지)
function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <!-- 전체를 감싸는 최상위 박스. 여기 style에 연노랑 배경을 줌 -->
  <div class="weather-mockup">
    <h2 class="page-title">🌦️ 오늘의 날씨</h2>

    <!-- 3. 양방향 바인딩: :value(값 보여주기) + @input(값 갱신하기)를 조합 -->
    <input
      type="text"
      class="search-box"
      :value="searchKeyword"
      @input="searchKeyword = $event.target.value"
      placeholder="도시 이름을 입력하세요"
    />
    <!-- searchKeyword가 빈 문자열이 아닐 때만(v-if) 검색어 문구를 보여줌 -->
    <p class="search-result" v-if="searchKeyword">
      검색어: <strong>{{ searchKeyword }}</strong>
    </p>

    <!-- selectedMessage가 있으면 파란 강조 스타일(status-active)을 추가로 붙임 -->
    <p class="status-bar" :class="{ 'status-active': selectedMessage }">
      {{ selectedMessage || '카드를 클릭하면 여기에 표시돼요' }}
    </p>

    <div class="card-grid">
      <!--
        1. v-for="city in weatherList": weatherList 배열을 하나씩 돌면서 city라는 이름으로 꺼냄
        :key="city.id": Vue가 각 카드를 구분할 수 있게 해주는 고유 값 (필수)
        @click="selectCity(city.name)": 카드 어디를 눌러도 이 함수가 실행됨
      -->
      <div
        v-for="city in weatherList"
        :key="city.id"
        class="weather-card"
        @click="selectCity(city.name)"
      >
        <div class="card-top">
          <h3 class="city-name">{{ city.name }}</h3>
          <span class="temp">{{ city.temp }}°</span>
        </div>
        <p class="city-status">{{ city.status }}</p>

        <!-- 2. 조건부 렌더링: 기온이 25도 이상/미만인지에 따라 둘 중 하나만 화면에 그려짐 -->
        <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge badge-cool">❄️ 선선함 (25도 미만)</span>

        <!--
          4. @click.stop: 이 버튼을 눌렀을 때, 클릭 이벤트가 부모 요소(.weather-card)까지
          전파(버블링)되지 않도록 막아줌. .stop이 없으면 버튼을 눌러도 카드의 @click
          (selectCity)까지 같이 실행돼서 상태바 문구도 함께 바뀌어 버림.
        -->
        <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체를 감싸는 최상위 박스 - 연노랑 둥근 사각형 배경(바닥) */

.weather-mockup {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;

  /* 연노랑 배경 + 큼직한 둥근 모서리 */
  background-color: #fff8dc;
  border-radius: 28px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #1f3a5f;
}

/* 검색 입력창 스타일 */
.search-box {
  width: 100%;
  box-sizing: border-box; /* padding을 넣어도 너비가 안 튀어나가게 함 */
  padding: 10px 14px;
  border: 1px solid #d5dbe3;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.search-box:focus {
  border-color: #2f6fed; /* 클릭해서 입력 중일 때 테두리 색 강조 */
}

.search-result {
  margin: 8px 2px 0;
  font-size: 13px;
  color: #555;
}

/* 상태바: 평소엔 회색, 카드를 누르면 status-active 클래스가 추가돼서 파랗게 강조됨 */
.status-bar {
  margin: 14px 0 20px;
  padding: 10px 14px;
  background: #ffffffaa; /* 살짝 투명한 흰색으로 연노랑 배경과 구분되게 */
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

/* 카드들을 2열 그리드로 배치 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* 카드 하나하나의 디자인 */
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
  transform: translateY(-3px); /* 마우스 올리면 살짝 떠오르는 효과 */
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
  color: #222;
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

/* 온도 라벨(뱃지) 공통 스타일 + 더움/선선함 색 구분 */
.badge {
  display: inline-block;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px; /* 값을 크게 줘서 둥근 알약 모양으로 만듦 */
  margin-bottom: 12px;
}
.badge-hot {
  background: #ffe8e0;
  color: #d64c2e;
}
.badge-cool {
  background: #e5f3ff;
  color: #1c7ed6;
}

/* 상세보기 버튼 */
.detail-btn {
  display: block;
  width: 100%;
  padding: 8px 0;
  background: #2f6fed;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s;
}
.detail-btn:hover {
  background: #1f5bd0;
}
</style>
