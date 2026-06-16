<template>
  <div class="dashboard">
    <h2 class="page-title">健康数据面板</h2>

    <!-- 健康指标卡片 — 全部来自实际记录 -->
    <div class="metrics-grid">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.label"
        :icon="metric.icon"
        :value="metric.value"
        :unit="metric.unit"
        :label="metric.label"
        :color="metric.color"
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-container">
        <h3 class="chart-title">近7天饮水量趋势 (ml)</h3>
        <v-chart v-if="hasWaterData" class="chart" :option="waterChartOption" autoresize />
        <el-empty v-else description="暂无饮水记录，去添加一些吧" :image-size="100" />
      </div>
      <div class="chart-container">
        <h3 class="chart-title">运动类型分布</h3>
        <v-chart v-if="hasSportData" class="chart" :option="sportChartOption" autoresize />
        <el-empty v-else description="暂无运动记录，去添加一些吧" :image-size="100" />
      </div>
    </div>

    <!-- 推荐运动 — 通过 axios 异步请求外部 API -->
    <div class="tips-section">
      <h3 class="section-title">推荐运动项目</h3>
      <p class="section-subtitle">数据来自 WGER 开放运动数据库</p>

      <div v-if="!exercises.length && !exerciseLoading && !exerciseError" class="fetch-trigger">
        <el-button type="primary" size="large" :icon="Download" :loading="exerciseLoading" @click="fetchExercises">
          获取推荐运动
        </el-button>
      </div>

      <div v-if="exerciseLoading" class="loading-area">
        <el-icon :size="24" class="loading-icon"><Loading /></el-icon>
        <span>正在加载推荐运动...</span>
      </div>

      <div v-if="exerciseError" class="error-area">
        <el-alert
          title="运动数据加载失败"
          :description="exerciseError"
          type="warning"
          show-icon
          :closable="false"
        />
        <el-button type="primary" size="small" style="margin-top: 10px" @click="fetchExercises">重试</el-button>
      </div>

      <div v-if="exercises.length" class="exercise-grid">
        <div v-for="ex in exercises" :key="ex.id" class="exercise-card">
          <div class="exercise-header">
            <span class="exercise-name">{{ ex.name }}</span>
            <el-tag size="small" type="success">{{ ex.category }}</el-tag>
          </div>
          <p class="exercise-desc">{{ ex.description }}</p>
        </div>
      </div>

      <div v-if="exercises.length" style="text-align: center; margin-top: 14px;">
        <el-button :icon="Refresh" size="small" @click="fetchExercises">换一批</el-button>
      </div>
    </div>

    <!-- 健康小贴士 -->
    <div class="tips-section">
      <h3 class="section-title">健康小贴士</h3>
      <div class="tips-list">
        <div v-for="tip in dailyTips" :key="tip.id" class="tip-item">
          <el-icon :size="18" color="#2ecc71"><Check /></el-icon>
          <span>{{ tip.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { supabase } from '../lib/supabase.js'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { Download, Refresh } from '@element-plus/icons-vue'
import MetricCard from './MetricCard.vue'

use([CanvasRenderer, LineChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// ---------- localStorage 数据 ----------

const waterRecords = ref([])
const sportRecords = ref([])

async function loadAllData() {
  try {
    const [wRes, sRes] = await Promise.all([
      supabase.from('water_records').select('*'),
      supabase.from('sport_records').select('*')
    ])
    if (!wRes.error) waterRecords.value = wRes.data || []
    if (!sRes.error) sportRecords.value = sRes.data || []
  } catch {
    waterRecords.value = []
    sportRecords.value = []
  }
  buildWaterChart()
  buildSportChart()
}

// ---------- 指标计算 ----------

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const todayTotalWater = computed(() => {
  const today = getTodayStr()
  return waterRecords.value
    .filter(r => r.date === today)
    .reduce((sum, r) => sum + (r.amount || 0), 0)
})

const totalSportCount = computed(() => sportRecords.value.length)
const totalSportDuration = computed(() => sportRecords.value.reduce((sum, r) => sum + (r.duration || 0), 0))
const totalSportCalories = computed(() => sportRecords.value.reduce((sum, r) => sum + (r.calories || 0), 0))

const hasWaterData = computed(() => waterRecords.value.length > 0)
const hasSportData = computed(() => sportRecords.value.length > 0)

const metrics = computed(() => [
  {
    icon: 'DishDot',
    value: todayTotalWater.value > 0 ? todayTotalWater.value : '--',
    unit: 'ml',
    label: '今日饮水',
    color: '#2ecc71'
  },
  {
    icon: 'Baseball',
    value: totalSportCount.value > 0 ? totalSportCount.value : '--',
    unit: '次',
    label: '运动总次数',
    color: '#f39c12'
  },
  {
    icon: 'Timer',
    value: totalSportDuration.value > 0 ? totalSportDuration.value : '--',
    unit: 'min',
    label: '运动总时长',
    color: '#3498db'
  },
  {
    icon: 'Fire',
    value: totalSportCalories.value > 0 ? totalSportCalories.value : '--',
    unit: '千卡',
    label: '累计消耗热量',
    color: '#e74c3c'
  }
])

// ---------- 图表 ----------

const waterChartOption = ref({})
const sportChartOption = ref({})

function buildWaterChart() {
  const dates = []
  const values = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`
    dates.push(dateStr)
    const dayTotal = waterRecords.value
      .filter(w => w.date === `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
      .reduce((sum, w) => sum + (w.amount || 0), 0)
    values.push(dayTotal)
  }
  waterChartOption.value = {
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates, axisLine: { lineStyle: { color: '#ccc' } } },
    yAxis: { type: 'value', name: '饮水量(ml)', min: 0 },
    series: [{
      data: values,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#2ecc71', width: 3 },
      areaStyle: { color: 'rgba(46, 204, 113, 0.15)' },
      itemStyle: { color: '#2ecc71' }
    }]
  }
}

function buildSportChart() {
  const countMap = {}
  sportRecords.value.forEach(s => {
    countMap[s.type] = (countMap[s.type] || 0) + 1
  })
  const chartData = Object.entries(countMap).map(([name, value]) => ({ name, value }))
  sportChartOption.value = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%' },
      data: chartData,
      color: ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c', '#e67e22', '#95a5a6']
    }]
  }
}

// ---------- 外部 API 异步请求：推荐运动 ----------

const exercises = ref([])
const exerciseLoading = ref(false)
const exerciseError = ref('')

async function fetchExercises() {
  exerciseLoading.value = true
  exerciseError.value = ''
  try {
    const offset = Math.floor(Math.random() * 200)
    const res = await axios.get('https://wger.de/api/v2/exerciseinfo/', {
      params: { limit: 6, offset }
    })
    exercises.value = res.data.results.map(item => {
      const t = item.translations?.[0] || {}
      return {
        id: item.id,
        name: t.name || '未命名运动',
        description: t.description
          ? t.description.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
          : '暂无详细描述',
        category: item.category?.name || '综合'
      }
    })
  } catch {
    exerciseError.value = '无法连接运动数据库（wger.de），请检查网络后刷新页面重试。'
    exercises.value = []
  } finally {
    exerciseLoading.value = false
  }
}

// ---------- 健康小贴士 ----------

const dailyTips = [
  { id: 1, content: '每天至少饮用 1500-2000ml 水，保持身体水分平衡' },
  { id: 2, content: '每周进行 150 分钟中等强度有氧运动有益心血管健康' },
  { id: 3, content: '成年人每晚建议睡眠 7-9 小时，保证充足休息' },
  { id: 4, content: '每坐 1 小时应起身活动 5 分钟，避免久坐危害' },
  { id: 5, content: '均衡饮食，每天摄入多种颜色的蔬菜水果' }
]

// ---------- 生命周期 ----------

onMounted(async () => {
  await loadAllData()
})
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-container {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text);
  align-self: flex-start;
}

.chart {
  width: 100%;
  height: 280px;
}

.tips-section {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text);
}

.section-subtitle {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 16px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--primary-light);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
}

.fetch-trigger {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.loading-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: var(--text-light);
  font-size: 14px;
}

.loading-icon {
  animation: spin 1s linear infinite;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-area {
  margin-bottom: 8px;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.exercise-card {
  background: #fdfdfd;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 14px 16px;
  transition: var(--transition);
}

.exercise-card:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.1);
}

.exercise-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.exercise-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.exercise-desc {
  font-size: 13px;
  color: var(--text-light);
  line-height: 1.6;
}
</style>
