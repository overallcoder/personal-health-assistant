<template>
  <div class="metric-card" :style="{ borderTopColor: color }">
    <div class="metric-icon">
      <el-icon :size="32" :color="color"><component :is="icon" /></el-icon>
    </div>
    <div class="metric-info">
      <span class="metric-value">{{ value }}</span>
      <span class="metric-unit">{{ unit }}</span>
    </div>
    <span class="metric-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  label: { type: String, required: true },
  color: { type: String, default: '#2ecc71' }
})
</script>

<style scoped>
.metric-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow);
  border-top: 4px solid var(--primary);
  transition: var(--transition);
  min-width: 140px;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.metric-icon {
  margin-bottom: 4px;
}

.metric-info {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
}

.metric-unit {
  font-size: 13px;
  color: var(--text-light);
}

.metric-label {
  font-size: 13px;
  color: var(--text-light);
}
</style>
