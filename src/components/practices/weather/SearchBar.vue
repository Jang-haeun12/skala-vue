<script setup>
defineProps({
  currentQuery: { type: String, default: '' },
})
defineEmits(['update-query'])
</script>

<template>
  <input
    type="text"
    class="search-box"
    :value="currentQuery"
    @input="$emit('update-query', $event.target.value)"
    placeholder="도시 이름을 입력하세요"
  />
</template>

<style scoped>
.search-box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #d5dbe3;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}
.search-box:focus {
  border-color: #2f6fed;
}
</style>
