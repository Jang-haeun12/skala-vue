<!-- 이 파일에는 처음 Code Challenge부터 Vue Components > Component Slot(Scoped Slot Example)까지의 연습을 담았습니다 -->
<script setup>
import { ref, reactive, computed, watch, watchEffect, onMounted, onUpdated, onUnmounted } from 'vue'

// ────────────────────────────────────────────
// [Code Challenge] 학습환경 구성 - Reactivity Example / Text Interpolation Example
// ────────────────────────────────────────────
const message = ref('안녕하세요, Vue!')
const randomTip = computed(() => `랜덤 숫자: ${Math.ceil(Math.random() * 100)}`)

// ────────────────────────────────────────────
// [Code Challenge] Vue Directive
//    v-html / v-html XSS / v-text / v-bind(기본,클래스,스타일,축약) /
//    v-if / v-else-if / v-else / v-show / v-for / v-pre / v-cloak / v-once / v-memo
// ────────────────────────────────────────────
const htmlContent = ref('<strong>굵은 글씨</strong> (v-html)')
const xssAttempt = ref('<img src=x onerror="alert(1)">') // v-html XSS 위험성 확인용 (사용자 입력을 그대로 넣으면 위험함)
const plainText = ref('<strong>이건 태그가 그대로 글자로 보여요</strong> (v-text)')
const boxColor = ref('#4b6584')
const isActive = ref(true)
const score = ref(72)
const fruits = ref(['사과', '바나나', '포도'])
const onceOnlyCount = ref(0)
function increaseOnce() {
  onceOnlyCount.value++
}

// ────────────────────────────────────────────
// [Code Challenge] Vue Event Handling - v-on Event Handler / Event Object / Event Modifier
// ────────────────────────────────────────────
const clickCount = ref(0)
function handleClick() {
  clickCount.value++
}
function handleClickWithEvent(event) {
  console.log('이벤트 객체:', event, '클릭한 태그:', event.target.tagName)
}

// ────────────────────────────────────────────
// [Code Challenge] Vue Form Handling(v-model, Modifiers) + Vue Style Example
// ────────────────────────────────────────────
const userName = ref('')
const userNameTrimmed = ref('')
const userAge = ref(0)
const agreeTerms = ref(false)
const selectedFruit = ref('apple')
const styleColor = ref('tomato')

// ────────────────────────────────────────────
// [Code Challenge] Composition API - Reactive State (ref() / reactive())
// ────────────────────────────────────────────
const refCount = ref(0)
const reactiveUser = reactive({ name: '하은', age: 25 })

// ────────────────────────────────────────────
// [Code Challenge] Composition API - Computed & Watchers
//    computed() / watch() / watch(Multi-Source) / watch(Deep) / watch(reactive) / watchEffect()
// ────────────────────────────────────────────
const priceA = ref(1000)
const priceB = ref(2000)
const totalPrice = computed(() => priceA.value + priceB.value)

watch(priceA, (newVal, oldVal) => {
  console.log(`[watch] priceA: ${oldVal} -> ${newVal}`)
})
watch([priceA, priceB], ([newA, newB], [oldA, oldB]) => {
  console.log(`[watch multi-source] A:${oldA}->${newA}, B:${oldB}->${newB}`)
})
const deepObj = reactive({ nested: { value: 1 } })
watch(
  deepObj,
  (newVal) => {
    console.log('[watch deep] nested.value 변경:', newVal.nested.value)
  },
  { deep: true },
)
watch(reactiveUser, (newVal) => {
  console.log('[watch reactive] 사용자 정보 변경:', newVal)
})
watchEffect(() => {
  console.log(`[watchEffect] 현재 총합: ${totalPrice.value}`)
})

// ────────────────────────────────────────────
// [Code Challenge] Component Lifecycle - Lifecycle Hook Example
// ────────────────────────────────────────────
onMounted(() => console.log('[Lifecycle] onMounted - 컴포넌트가 화면에 붙었습니다.'))
onUpdated(() => console.log('[Lifecycle] onUpdated - 화면이 갱신되었습니다.'))
onUnmounted(() => console.log('[Lifecycle] onUnmounted - 컴포넌트가 제거되었습니다.'))

// ────────────────────────────────────────────
// [Code Challenge] Props & Emits Example
//    (별도 파일 대신, 같은 파일 안에 간단한 자식 컴포넌트를 객체로 정의해서 사용)
// ────────────────────────────────────────────
const ChildGreeting = {
  props: { name: { type: String, required: true } },
  emits: ['say-hello'],
  template: `
    <div class="child-box">
      <p>안녕하세요, {{ name }}님!</p>
      <button @click="$emit('say-hello', name)">인사하기</button>
    </div>
  `,
}
const greetLog = ref('')
function handleSayHello(name) {
  greetLog.value = `${name}님이 인사했습니다.`
}

// ────────────────────────────────────────────
// [Code Challenge] Component Slot - Default / Named / Scoped Slot Example
// ────────────────────────────────────────────
const DefaultSlotBox = {
  template: `<div class="slot-box"><slot>기본 내용(부모가 안 넣으면 이게 보임)</slot></div>`,
}
const NamedSlotCard = {
  template: `
    <div class="slot-box">
      <header><slot name="header">제목 없음</slot></header>
      <main><slot>본문 없음</slot></main>
      <footer><slot name="footer">푸터 없음</slot></footer>
    </div>
  `,
}
const scopedFruits = ref(['사과', '바나나', '포도'])
const ScopedSlotList = {
  props: { items: { type: Array, required: true } },
  template: `
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index">{{ item }}</slot>
      </li>
    </ul>
  `,
}
</script>

<template>
  <div class="practice-file">
    <h1>Sample 1 — Code Challenge 모음 (Vue Syntax ~ Component Slot)</h1>

    <section class="cc-section">
      <h2>1. 학습환경 구성 (Reactivity / Text Interpolation)</h2>
      <p>{{ message }}</p>
      <p>{{ message.toUpperCase() }}</p>
      <p>{{ randomTip }}</p>
    </section>

    <section class="cc-section">
      <h2>2. Vue Directive</h2>
      <p>v-html: <span v-html="htmlContent"></span></p>
      <p>v-html(XSS 예시): <span v-html="xssAttempt"></span></p>
      <p>v-text: <span v-text="plainText"></span></p>
      <p :style="{ backgroundColor: boxColor, padding: '8px', color: 'white' }">
        v-bind(Style Binding)
      </p>
      <p :class="{ active: isActive }" class="base-box">v-bind(Class Binding)</p>
      <button :disabled="score < 60">v-bind(Shorthand, :disabled)</button>
      <p v-if="score >= 90">v-if: 수(90점 이상)</p>
      <p v-else-if="score >= 70">v-else-if: 우(70~89점)</p>
      <p v-else>v-else: 미(70점 미만)</p>
      <p v-show="isActive">v-show: isActive가 true일 때만 보임</p>
      <ul>
        <li v-for="(fruit, idx) in fruits" :key="idx">v-for: {{ idx }} - {{ fruit }}</li>
      </ul>
      <p v-once>v-once: 한 번만 렌더링됨 - {{ onceOnlyCount }}</p>
      <button @click="increaseOnce">숫자 증가 (위 텍스트는 안 바뀜)</button>
    </section>

    <section class="cc-section">
      <h2>3. Vue Event Handling</h2>
      <button @click="handleClick">클릭 횟수: {{ clickCount }}</button>
      <button @click="handleClickWithEvent">이벤트 객체 콘솔 출력</button>
      <button @click.stop.prevent="handleClick">Event Modifier(.stop.prevent)</button>
    </section>

    <section class="cc-section">
      <h2>4. Vue Form Handling / Vue Style</h2>
      <input v-model="userName" placeholder="이름 입력" />
      <input v-model.trim="userNameTrimmed" placeholder=".trim (앞뒤 공백 제거)" />
      <input v-model.number="userAge" type="number" placeholder=".number (숫자 변환)" />
      <label><input type="checkbox" v-model="agreeTerms" /> 약관 동의</label>
      <select v-model="selectedFruit">
        <option value="apple">사과</option>
        <option value="banana">바나나</option>
      </select>
      <p>
        {{ userName }} / {{ userNameTrimmed }} / {{ userAge }} / {{ agreeTerms }} /
        {{ selectedFruit }}
      </p>
      <p :style="{ color: styleColor, fontWeight: 'bold' }">Vue Style Example: {{ styleColor }}</p>
    </section>

    <section class="cc-section">
      <h2>5. Reactive State (ref / reactive)</h2>
      <p>ref(): {{ refCount }} <button @click="refCount++">증가</button></p>
      <p>
        reactive(): {{ reactiveUser.name }} ({{ reactiveUser.age }}세)
        <button @click="reactiveUser.age++">나이 증가</button>
      </p>
    </section>

    <section class="cc-section">
      <h2>6. Computed & Watchers</h2>
      <p>
        가격A: <input v-model.number="priceA" type="number" /> 가격B:
        <input v-model.number="priceB" type="number" />
      </p>
      <p>computed 합계: {{ totalPrice }}</p>
      <p>
        deepObj.nested.value: {{ deepObj.nested.value }}
        <button @click="deepObj.nested.value++">변경</button>
      </p>
      <p>watch/watchEffect 로그는 콘솔(F12)에서 확인</p>
    </section>

    <section class="cc-section">
      <h2>7. Component Lifecycle</h2>
      <p>onMounted / onUpdated / onUnmounted 로그는 콘솔에서 확인</p>
    </section>

    <section class="cc-section">
      <h2>8. Props & Emits</h2>
      <component :is="ChildGreeting" name="하은" @say-hello="handleSayHello" />
      <p>{{ greetLog }}</p>
    </section>

    <section class="cc-section">
      <h2>9. Component Slot</h2>
      <h3>Default Slot</h3>
      <component :is="DefaultSlotBox">
        <p>부모가 넣은 내용 (Default Slot)</p>
      </component>

      <h3>Named Slot</h3>
      <component :is="NamedSlotCard">
        <template #header><strong>카드 제목</strong></template>
        <p>카드 본문 내용</p>
        <template #footer><small>카드 푸터</small></template>
      </component>

      <h3>Scoped Slot</h3>
      <component :is="ScopedSlotList" :items="scopedFruits">
        <template #default="{ item, index }"> {{ index + 1 }}번째 과일: {{ item }} </template>
      </component>
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
.active {
  color: #2f6fed;
  font-weight: bold;
}
.child-box {
  border: 1px dashed #999;
  padding: 8px;
  margin-top: 8px;
}
.slot-box {
  border: 1px solid #ccc;
  padding: 8px;
  margin-top: 8px;
}
</style>
