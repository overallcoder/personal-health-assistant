<template>
  <div class="sport-item">
    <div class="sport-type-badge" :style="{ background: typeColor }">
      <el-icon :size="18" color="#fff"><Baseball /></el-icon>
    </div>
    <div class="sport-info">
      <span class="sport-type">{{ record.type }}</span>
      <el-tag v-if="record.intensity" size="small" :type="intensityType">{{ record.intensity }}</el-tag>
      <span class="sport-duration">{{ record.duration }} 分钟</span>
      <span class="sport-calories">{{ record.calories }} 千卡</span>
      <span v-if="record.location" class="sport-location">@{{ record.location }}</span>
    </div>
    <span class="sport-date">{{ record.date }}</span>
    <el-button type="danger" size="small" :icon="Delete" circle text @click="$emit('delete', record.id)" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const colors = {
  '跑步': '#e74c3c',
  '游泳': '#3498db',
  '骑行': '#f39c12',
  '瑜伽': '#9b59b6',
  '篮球': '#e67e22',
  '健身': '#1abc9c',
  '跳绳': '#e91e63',
  '其他': '#95a5a6'
}

const props = defineProps({
  record: { type: Object, required: true }
})

defineEmits(['delete'])

const typeColor = computed(() => colors[props.record.type] || '#95a5a6')

const intensityType = computed(() => {
  const map = { '轻度': '', '中度': 'warning', '高强度': 'danger' }
  return map[props.record.intensity] || ''
})
</script>

<style scoped>
.sport-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #fdfdfd;
  border-radius: 8px;
  border: 1px solid #eee;
  transition: var(--transition);
}

.sport-item:hover {
  background: #f8f9fa;
  transform: translateX(4px);
}

.sport-type-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sport-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sport-type {
  font-weight: 600;
  font-size: 15px;
  min-width: 48px;
}

.sport-duration {
  font-size: 14px;
  color: #2980b9;
}

.sport-calories {
  font-size: 14px;
  color: #e74c3c;
}

.sport-location {
  font-size: 13px;
  color: #7f8c8d;
}

.sport-date {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-light);
}
</style>
