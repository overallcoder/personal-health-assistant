<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <div
        v-for="item in menuItems"
        :key="item.key"
        class="nav-item"
        :class="{ active: activeMenu === item.key }"
        @click="$emit('menu-change', item.key)"
      >
        <el-icon :size="20"><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  menuItems: {
    type: Array,
    required: true
  },
  activeMenu: {
    type: String,
    required: true
  }
})

defineEmits(['menu-change'])
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background: var(--white);
  box-shadow: var(--shadow);
  padding: 16px 0;
  z-index: 999;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 15px;
  color: var(--text);
  user-select: none;
}

.nav-item:hover {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.nav-item.active {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: var(--white);
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
}
</style>
