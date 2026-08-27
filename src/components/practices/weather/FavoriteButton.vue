<script setup>
defineProps({
  isFavorite: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>

<template>
  <button class="star-btn" :class="{ starred: isFavorite }" @click.stop="$emit('toggle')">★</button>
</template>

<style scoped>
.star-btn {
  border: 1px solid #eee;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #ccc;
  font-size: 14px;
  padding: 0 10px;
}
.star-btn.starred {
  color: #f5b301;
  border-color: #f5b301;
}
</style>
