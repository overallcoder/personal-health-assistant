<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="80px"
    label-position="top"
    class="sport-form"
  >
    <el-row :gutter="16">
      <el-col :span="8">
        <el-form-item label="运动类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择运动类型" size="large">
            <el-option v-for="opt in sportTypes" :key="opt" :label="opt" :value="opt" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运动时长(分钟)" prop="duration">
          <el-input-number
            v-model="form.duration"
            :min="1"
            :max="480"
            :step="5"
            size="large"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="消耗热量(千卡)" prop="calories">
          <el-input-number
            v-model="form.calories"
            :min="1"
            :max="5000"
            :step="10"
            size="large"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="运动强度" prop="intensity">
          <el-radio-group v-model="form.intensity" size="large">
            <el-radio-button value="轻度">轻度</el-radio-button>
            <el-radio-button value="中度">中度</el-radio-button>
            <el-radio-button value="高强度">高强度</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运动地点" prop="location">
          <el-input v-model="form.location" placeholder="如：操场、健身房、家里" size="large" maxlength="30" show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注">
      <el-input
        v-model="form.note"
        type="textarea"
        :rows="2"
        placeholder="可选：记录运动感受..."
        maxlength="200"
        show-word-limit
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="large" :icon="Plus" @click="handleSubmit">添加记录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const sportTypes = ['跑步', '游泳', '骑行', '瑜伽', '篮球', '健身', '跳绳', '其他']

const emit = defineEmits(['submit'])

const formRef = ref(null)

const form = reactive({
  type: '',
  duration: 30,
  calories: 200,
  intensity: '中度',
  location: '',
  note: ''
})

const rules = {
  type: [{ required: true, message: '请选择运动类型', trigger: 'change' }],
  duration: [
    { required: true, message: '请输入运动时长', trigger: 'blur' },
    { type: 'number', min: 1, max: 480, message: '时长范围: 1-480分钟', trigger: 'blur' }
  ],
  calories: [
    { required: true, message: '请输入消耗热量', trigger: 'blur' },
    { type: 'number', min: 1, max: 5000, message: '热量范围: 1-5000千卡', trigger: 'blur' }
  ],
  intensity: [{ required: true, message: '请选择运动强度', trigger: 'change' }],
  location: [{ required: true, message: '请输入运动地点', trigger: 'blur' }]
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...form })
      formRef.value.resetFields()
      form.type = ''
      form.duration = 30
      form.calories = 200
      form.intensity = '中度'
      form.location = ''
      form.note = ''
    }
  })
}
</script>

<style scoped>
.sport-form {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}
</style>
