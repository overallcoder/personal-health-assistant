<template>
  <div class="sport-list">
    <div v-if="records.length > 0" class="records-list">
      <SportItem
        v-for="record in records"
        :key="record.id"
        :record="record"
        @delete="$emit('delete', $event)"
      />
    </div>
    <el-empty v-else description="暂无运动记录" :image-size="80" />
  </div>
</template>

<script setup>
import SportItem from './SportItem.vue'

defineProps({
  records: { type: Array, required: true }
})

defineEmits(['delete'])
</script>

<style scoped>
.sport-list {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
