<template>
  <div class="water-intake">
    <h2 class="page-title">饮水记录</h2>

    <div v-if="errorMsg" class="error-bar">
      <el-alert :title="errorMsg" type="error" show-icon :closable="false" />
    </div>

    <div class="progress-card">
      <div class="progress-header">
        <span class="progress-label">今日饮水量</span>
        <span class="progress-value">{{ todayTotal }} / {{ dailyGoal }} ml</span>
      </div>
      <el-progress
        :percentage="progressPercent"
        :color="progressColor"
        :stroke-width="16"
        :striped="true"
        :striped-flow="true"
      />
      <p v-if="progressPercent >= 100" class="congrats">今天饮水目标已达成!</p>
    </div>

    <div class="add-form">
      <el-input-number
        v-model="newAmount"
        :min="50"
        :max="1000"
        :step="50"
        placeholder="饮水量(ml)"
        size="large"
      />
      <el-button type="primary" size="large" :icon="Plus" @click="addRecord">添加记录</el-button>
      <el-button size="large" @click="addQuickWater(200)">+200ml</el-button>
      <el-button size="large" @click="addQuickWater(300)">+300ml</el-button>
      <el-button size="large" @click="addQuickWater(500)">+500ml</el-button>
    </div>

    <div class="records-section">
      <h3 class="section-title">今日记录</h3>
      <div v-if="loading" class="loading-area"><el-icon :size="24" class="loading-icon"><Loading /></el-icon><span>加载中...</span></div>
      <div v-else-if="todayRecords.length > 0" class="records-list">
        <WaterItem v-for="record in todayRecords" :key="record.id" :record="record" @delete="deleteRecord" />
      </div>
      <el-empty v-else description="今天还没有喝水记录" :image-size="80" />
    </div>

    <div class="records-section">
      <h3 class="section-title">历史记录</h3>
      <div v-if="historyRecords.length > 0" class="records-list">
        <WaterItem v-for="record in historyRecords" :key="record.id" :record="record" @delete="deleteRecord" />
      </div>
      <el-empty v-else description="暂无历史记录" :image-size="80" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../composables/useAuth.js'
import WaterItem from './WaterItem.vue'

const { user } = useAuth()

const dailyGoal = 2000

const records = ref([])
const newAmount = ref(250)
const loading = ref(true)
const errorMsg = ref('')

function getDateStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getTimeStr() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const todayStr = computed(() => getDateStr())

const todayRecords = computed(() => records.value.filter(r => r.date === todayStr.value))

const historyRecords = computed(() => records.value.filter(r => r.date !== todayStr.value))

const todayTotal = computed(() => todayRecords.value.reduce((sum, r) => sum + r.amount, 0))

const progressPercent = computed(() => Math.min(Math.round((todayTotal.value / dailyGoal) * 100), 100))

const progressColor = computed(() => {
  if (progressPercent.value >= 100) return '#2ecc71'
  if (progressPercent.value >= 50) return '#3498db'
  return '#f39c12'
})

async function loadRecords() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, error } = await supabase
      .from('water_records')
      .select('*')
      .order('id', { ascending: false })
    if (error) throw error
    records.value = data || []
  } catch (err) {
    errorMsg.value = '加载饮水记录失败：' + (err.message || '未知错误')
    records.value = []
  } finally {
    loading.value = false
  }
}

async function addRecord() {
  errorMsg.value = ''
  const record = { amount: newAmount.value, date: todayStr.value, time: getTimeStr(), user_id: user.value.id }
  try {
    const { data, error } = await supabase.from('water_records').insert(record).select().single()
    if (error) throw error
    records.value.unshift(data)
    newAmount.value = 250
  } catch (err) {
    errorMsg.value = '添加失败：' + (err.message || '未知错误')
  }
}

async function addQuickWater(amount) {
  errorMsg.value = ''
  const record = { amount, date: todayStr.value, time: getTimeStr(), user_id: user.value.id }
  try {
    const { data, error } = await supabase.from('water_records').insert(record).select().single()
    if (error) throw error
    records.value.unshift(data)
  } catch (err) {
    errorMsg.value = '添加失败：' + (err.message || '未知错误')
  }
}

async function deleteRecord(id) {
  errorMsg.value = ''
  try {
    const { error } = await supabase.from('water_records').delete().eq('id', id)
    if (error) throw error
    records.value = records.value.filter(r => r.id !== id)
  } catch (err) {
    errorMsg.value = '删除失败：' + (err.message || '未知错误')
  }
}

onMounted(() => loadRecords())
</script>

<style scoped>
.water-intake { max-width: 800px; }
.page-title { font-size: 22px; font-weight: 600; margin-bottom: 24px; }

.error-bar { margin-bottom: 16px; }

.progress-card {
  background: var(--white); border-radius: var(--radius); padding: 24px;
  box-shadow: var(--shadow); margin-bottom: 20px;
}
.progress-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.progress-label { font-weight: 600; font-size: 15px; }
.progress-value { color: var(--text-light); font-size: 14px; }
.congrats { margin-top: 12px; text-align: center; color: #2ecc71; font-weight: 600; font-size: 16px; }

.add-form { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 24px; }

.records-section {
  background: var(--white); border-radius: var(--radius); padding: 20px;
  box-shadow: var(--shadow); margin-bottom: 16px;
}
.section-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
.records-list { display: flex; flex-direction: column; gap: 8px; }

.loading-area {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 24px; color: var(--text-light); font-size: 14px;
}
.loading-icon { animation: spin 1s linear infinite; color: var(--primary); }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
