<template>
  <header class="app-header">
    <div class="header-left">
      <el-icon :size="28" color="#fff"><Plus /></el-icon>
      <h1 class="header-title">个人健康助手</h1>
    </div>
    <div class="header-right">
      <span class="header-date">{{ currentDate }}</span>
      <span class="header-user">{{ user?.email }}</span>
      <el-button text size="small" class="logout-btn" @click="handleLogout">退出</el-button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { user, signOut } = useAuth()

const currentDate = ref('')

function updateDate() {
  const now = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  currentDate.value = now.toLocaleDateString('zh-CN', options)
}

function handleLogout() {
  signOut()
}

onMounted(() => {
  updateDate()
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-date {
  font-size: 13px;
  opacity: 0.85;
}

.header-user {
  font-size: 13px;
  opacity: 0.9;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
}

.logout-btn {
  color: #fff !important;
  font-size: 13px;
  opacity: 0.8;
}

.logout-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15) !important;
}
</style>
