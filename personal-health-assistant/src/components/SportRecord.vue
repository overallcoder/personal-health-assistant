<template>
  <div class="sport-record">
    <h2 class="page-title">运动记录</h2>

    <div v-if="errorMsg" class="error-bar">
      <el-alert :title="errorMsg" type="error" show-icon :closable="false" />
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-value">{{ totalCount }}</span>
        <span class="stat-label">总次数</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ totalDuration }}</span>
        <span class="stat-label">总时长(分钟)</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ totalCalories }}</span>
        <span class="stat-label">总热量(千卡)</span>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">新增运动记录</h3>
      <SportForm @submit="addRecord" />
    </div>

    <div class="list-section">
      <h3 class="section-title">运动记录列表</h3>
      <div v-if="loading" class="loading-area"><el-icon :size="24" class="loading-icon"><Loading /></el-icon><span>加载中...</span></div>
      <SportList v-else :records="records" @delete="deleteRecord" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../composables/useAuth.js'
import SportForm from './SportForm.vue'
import SportList from './SportList.vue'

const { user } = useAuth()

const records = ref([])
const loading = ref(true)
const errorMsg = ref('')

const totalCount = computed(() => records.value.length)
const totalDuration = computed(() => records.value.reduce((sum, r) => sum + r.duration, 0))
const totalCalories = computed(() => records.value.reduce((sum, r) => sum + r.calories, 0))

function getDateStr() {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate()}`
}

async function loadRecords() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, error } = await supabase
      .from('sport_records')
      .select('*')
      .order('id', { ascending: false })
    if (error) throw error
    records.value = data || []
  } catch (err) {
    errorMsg.value = '加载运动记录失败：' + (err.message || '未知错误')
    records.value = []
  } finally {
    loading.value = false
  }
}

async function addRecord(formData) {
  errorMsg.value = ''
  const record = { ...formData, date: getDateStr(), user_id: user.value.id }
  try {
    const { data, error } = await supabase.from('sport_records').insert(record).select().single()
    if (error) throw error
    records.value.unshift(data)
  } catch (err) {
    errorMsg.value = '添加失败：' + (err.message || '未知错误')
  }
}

async function deleteRecord(id) {
  errorMsg.value = ''
  try {
    const { error } = await supabase.from('sport_records').delete().eq('id', id)
    if (error) throw error
    records.value = records.value.filter(r => r.id !== id)
  } catch (err) {
    errorMsg.value = '删除失败：' + (err.message || '未知错误')
  }
}

onMounted(() => loadRecords())
</script>

<style scoped>
.sport-record { max-width: 900px; }
.page-title { font-size: 22px; font-weight: 600; margin-bottom: 24px; }

.error-bar { margin-bottom: 16px; }

.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.stat-card {
  flex: 1; background: var(--white); border-radius: var(--radius);
  padding: 20px; box-shadow: var(--shadow); text-align: center;
}
.stat-value { display: block; font-size: 28px; font-weight: 700; color: var(--primary); }
.stat-label { font-size: 13px; color: var(--text-light); margin-top: 4px; }

.form-section { margin-bottom: 24px; }
.section-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
.list-section { margin-bottom: 24px; }

.loading-area {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 24px; color: var(--text-light); font-size: 14px;
  background: var(--white); border-radius: var(--radius);
}
.loading-icon { animation: spin 1s linear infinite; color: var(--primary); }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
