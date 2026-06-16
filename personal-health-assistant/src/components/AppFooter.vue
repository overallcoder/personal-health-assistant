<template>
  <footer class="app-footer">
    <span>&copy; {{ year }} 个人健康助手 — 关注每一天的健康</span>
    <span class="footer-help">合理饮水 | 坚持运动 | 健康生活</span>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const year = ref(new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  height: var(--footer-height);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  font-size: 13px;
  color: var(--text-light);
  border-top: 1px solid #ecf0f1;
  margin-left: var(--sidebar-width);
  flex-shrink: 0;
}

.footer-help {
  color: var(--primary);
  font-weight: 500;
}
</style>
