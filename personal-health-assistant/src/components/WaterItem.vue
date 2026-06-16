<template>
  <div class="water-item">
    <div class="water-info">
      <el-icon :size="20" color="#3498db"><DishDot /></el-icon>
      <span class="water-amount">{{ record.amount }} ml</span>
      <span class="water-time">{{ record.time }}</span>
    </div>
    <el-button type="danger" size="small" :icon="Delete" circle text @click="$emit('delete', record.id)" />
  </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue'

defineProps({
  record: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])
</script>

<style scoped>
.water-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  transition: var(--transition);
}

.water-item:hover {
  background: #e8f4fd;
  transform: translateX(4px);
}

.water-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.water-amount {
  font-weight: 600;
  font-size: 16px;
  color: #2980b9;
}

.water-time {
  font-size: 13px;
  color: var(--text-light);
}
</style>
