<template>
  <div v-if="loading" class="auth-loading">
    <el-icon :size="32" class="spin-icon"><Loading /></el-icon>
    <span>加载中...</span>
  </div>
  <template v-else-if="user">
    <div class="app-container">
      <AppHeader />
      <div class="app-body">
        <AppSidebar :menu-items="menuItems" :active-menu="activeMenu" @menu-change="handleMenuChange" />
        <main class="main-content">
          <component :is="currentComponent" />
        </main>
      </div>
      <AppFooter />
    </div>
  </template>
  <AuthPage v-else />
</template>

<script setup>
import { ref, computed, markRaw, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
import Dashboard from './components/Dashboard.vue'
import WaterIntake from './components/WaterIntake.vue'
import SportRecord from './components/SportRecord.vue'
import AuthPage from './components/AuthPage.vue'
import { useAuth } from './composables/useAuth.js'

const { user, loading, init } = useAuth()

const menuItems = [
  { key: 'dashboard', label: '健康面板', icon: 'DataAnalysis' },
  { key: 'water', label: '饮水记录', icon: 'DishDot' },
  { key: 'sport', label: '运动记录', icon: 'Baseball' }
]

const activeMenu = ref('dashboard')

const componentMap = {
  dashboard: markRaw(Dashboard),
  water: markRaw(WaterIntake),
  sport: markRaw(SportRecord)
}

const currentComponent = computed(() => {
  return componentMap[activeMenu.value] || componentMap.dashboard
})

function handleMenuChange(key) {
  activeMenu.value = key
}

onMounted(() => init())
</script>

<style scoped>
.auth-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #7f8c8d;
  font-size: 15px;
  background: var(--bg);
}

.spin-icon {
  animation: spin 1s linear infinite;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
