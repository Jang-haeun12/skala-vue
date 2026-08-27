<script setup>
defineProps({
  currentQuery: { type: String, default: '' },
})
defineEmits(['update-query'])
</script>

<template>
  <!-- 기존 <input> 태그를 el-input으로 교체. el-input의 @input은 이벤트 객체가 아니라
       입력된 문자열 값을 그대로 넘겨주므로 $event.target.value가 아니라 $event만 쓰면 됨 -->
  <el-input
    :model-value="currentQuery"
    @input="$emit('update-query', $event)"
    placeholder="도시 이름을 입력하세요"
    clearable
    size="large"
  />
</template>

<style scoped></style>
