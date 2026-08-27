<!-- 이 파일에는 Code Challenge Pinia부터 마지막 챌린지(ESLint/Prettier/env/build)까지의 연습을 담았습니다 -->
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCounterStore } from '@/stores/counter'

// ────────────────────────────────────────────
// [Code Challenge] Pinia - Store(counter.js) 작성하기
//    - main.js에는 이미 app.use(createPinia())로 등록되어 있음 (Weather Store 핸즈온과 동일)
//    - stores/counter.js는 스캐폴딩 시 기본 제공된 파일 그대로 사용
//    - 원래 과제는 별도 파일(StoreCounter.vue)에서 쓰라고 되어있지만, 제출 편의상 여기서 같은 내용을 구현
//    - Vue Devtools의 Pinia 탭에서 count/doubleCount 값 실시간 확인함
// ────────────────────────────────────────────
const counterStore = useCounterStore()

// ────────────────────────────────────────────
// [Code Challenge] Axios 설치 + Axios Weather Example
// ────────────────────────────────────────────
const weatherData = ref(null)
const isWeatherLoading = ref(false)
const handleFetchWeather = async () => {
  isWeatherLoading.value = true
  try {
    const API_KEY = import.meta.env.VITE_OWM_API_KEY
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=Seoul,KR&appid=${API_KEY}&units=metric&lang=kr`
    const response = await axios.get(URL)
    weatherData.value = response.data
  } catch (error) {
    console.error('통신 중 에러 발생:', error)
  } finally {
    isWeatherLoading.value = false
  }
}

// ────────────────────────────────────────────
// [Code Challenge] Axios JSON Example (JSONPlaceholder CRUD)
// ────────────────────────────────────────────
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'
const posts = ref([])
const newPostTitle = ref('')
const handleRead = async () => {
  const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
  posts.value = response.data
}
const handleCreate = async () => {
  const response = await axios.post(BASE_URL, { title: newPostTitle.value })
  console.log('POST 성공:', response.data)
  ElMessage.success('게시글이 생성되었습니다. (Mock API라 실제 저장은 안 됨)')
}
const handleUpdate = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}`, { title: '수정된 제목' })
  console.log('PUT 성공:', response.data)
}
const handleDelete = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`)
  posts.value = posts.value.filter((post) => post.id !== id)
}

// ────────────────────────────────────────────
// [Code Challenge] UI Library - 회원가입 폼 (userForm)
// ────────────────────────────────────────────
const userForm = ref({ email: '', agree: false })
const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}

// ────────────────────────────────────────────
// [Code Challenge] UI Library - 상품 수량 / 별점
// ────────────────────────────────────────────
const productQuantity = ref(1)
const productRate = ref(4)

// ────────────────────────────────────────────
// [Code Challenge] UI Library - 삭제 Confirm + 다운로드 진행률
// ────────────────────────────────────────────
const downloadProgress = ref(0)
const isDownloading = ref(false)
const confirmDelete = () => {
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?', '🔥 최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.'))
    .catch(() => ElMessage.info('❌ 삭제 작업이 취소되었습니다.'))
}
const startDownload = () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadProgress.value = 0
  const interval = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
      clearInterval(interval)
      isDownloading.value = false
      ElMessage.success('💾 대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}
</script>

<template>
  <div class="practice-file">
    <h1>Sample 2 — Code Challenge 모음 (Pinia ~ 마지막)</h1>

    <section class="cc-section">
      <h2>1. Pinia - Store(counter.js)</h2>
      <p>count: {{ counterStore.count }} / doubleCount: {{ counterStore.doubleCount }}</p>
      <el-button type="primary" @click="counterStore.increment">increment()</el-button>
    </section>

    <section class="cc-section">
      <h2>2. Axios Weather Example</h2>
      <el-button type="primary" :loading="isWeatherLoading" @click="handleFetchWeather">
        실시간 날씨 당겨오기
      </el-button>
      <div v-if="weatherData">
        <p>
          {{ weatherData.name }} - {{ weatherData.main.temp }}°C,
          {{ weatherData.weather[0].description }}
        </p>
      </div>
    </section>

    <section class="cc-section">
      <h2>3. Axios JSON Example (CRUD)</h2>
      <el-button @click="handleRead">GET (조회)</el-button>
      <el-input
        v-model="newPostTitle"
        placeholder="새 게시글 제목"
        style="width: 200px; margin: 0 8px"
      />
      <el-button @click="handleCreate">POST (생성)</el-button>
      <ul>
        <li v-for="post in posts" :key="post.id">
          {{ post.title }}
          <el-button size="small" @click="handleUpdate(post.id)">PUT</el-button>
          <el-button size="small" type="danger" @click="handleDelete(post.id)">DELETE</el-button>
        </li>
      </ul>
    </section>

    <section class="cc-section">
      <h2>4. UI Library - 회원가입 폼</h2>
      <el-card>
        <el-input v-model="userForm.email" placeholder="이메일 입력" style="margin-bottom: 10px" />
        <el-switch v-model="userForm.agree" active-text="약관 동의" />
        <el-button type="primary" @click="handleRegister" style="margin-top: 10px"
          >가입하기</el-button
        >
      </el-card>
    </section>

    <section class="cc-section">
      <h2>5. UI Library - 상품 수량 / 별점</h2>
      <el-card>
        <p>수량: <el-input-number v-model="productQuantity" :min="1" :max="10" /></p>
        <p>별점: {{ productRate }} / 5</p>
      </el-card>
    </section>

    <section class="cc-section">
      <h2>6. UI Library - 삭제 Confirm / 다운로드 진행률</h2>
      <el-card>
        <el-button type="danger" @click="confirmDelete">파일 삭제 테스트</el-button>
        <el-button type="primary" :disabled="isDownloading" @click="startDownload"
          >동기화 시작</el-button
        >
        <el-progress :percentage="downloadProgress" style="margin-top: 10px" />
      </el-card>
    </section>

    <section class="cc-section">
      <h2>7. ESLint / Prettier / 환경변수 / Build (터미널 작업, 코드 없음)</h2>
      <ul>
        <li>ESLint Custom 규칙(eqeqeq, no-console) 적용 후 npm run lint로 검출 확인</li>
        <li>정렬 안 된 코드 작성 후 npm run format(Prettier)으로 자동 정렬 확인</li>
        <li>.env.staging / .env.production 생성 후 import.meta.env.VITE_API_URL 콘솔 출력 확인</li>
        <li>npm run build 실행 후 dist/, dist/assets/main-xxxx.js 생성 확인</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.practice-file {
  padding: 20px;
  font-family: sans-serif;
}
.cc-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
