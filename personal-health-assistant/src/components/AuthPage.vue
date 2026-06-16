<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <el-icon :size="36" color="#2ecc71"><Plus /></el-icon>
        <h1 class="auth-title">个人健康助手</h1>
        <p class="auth-subtitle">{{ isLogin ? '欢迎回来' : '创建您的账户' }}</p>
      </div>

      <div v-if="authError" class="auth-error">
        <el-alert :title="authError" type="error" show-icon :closable="false" />
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="auth-form"
        @keyup.enter="handleSubmit"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱地址"
            size="large"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="submit-btn"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-switch">
        <span>{{ isLogin ? '还没有账户？' : '已有账户？' }}</span>
        <el-button link type="primary" @click="toggleMode">
          {{ isLogin ? '立即注册' : '去登录' }}
        </el-button>
      </div>

      <el-divider>
        <span class="divider-text">或使用第三方登录</span>
      </el-divider>

      <div class="oauth-buttons" style="justify-content: center">
        <el-button size="large" class="oauth-btn github-btn" @click="handleOAuth('github')">
          <svg class="oauth-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub 登录</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Message, Lock } from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth.js'

const { error: authError, signIn, signUp, signInWithOAuth, clearError } = useAuth()

const isLogin = ref(true)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirm = (_rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = computed(() => ({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: isLogin.value
    ? []
    : [{ required: true, message: '请确认密码', trigger: 'blur' }, { validator: validateConfirm, trigger: 'blur' }]
}))

function toggleMode() {
  isLogin.value = !isLogin.value
  clearError()
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  clearError()

  try {
    if (isLogin.value) {
      await signIn(form.email, form.password)
    } else {
      await signUp(form.email, form.password)
    }
  } finally {
    submitting.value = false
  }
}

function handleOAuth(provider) {
  clearError()
  signInWithOAuth(provider)
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d5f5e3 0%, #f0f8f4 50%, #e8f8f0 100%);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 4px 24px rgba(46, 204, 113, 0.12);
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.auth-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 10px 0 4px;
}

.auth-subtitle {
  font-size: 14px;
  color: #7f8c8d;
}

.auth-error {
  margin-bottom: 16px;
}

.auth-form {
  margin-bottom: 4px;
}

.submit-btn {
  width: 100%;
}

.auth-switch {
  text-align: center;
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.divider-text {
  color: #bdc3c7;
  font-size: 13px;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.oauth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.oauth-btn:hover {
  border-color: #bdc3c7;
  background: #fafafa;
}

.oauth-icon {
  flex-shrink: 0;
}

.github-btn {
  color: #333;
}
</style>
