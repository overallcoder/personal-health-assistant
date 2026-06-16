import { ref, readonly } from 'vue'
import { supabase } from '../lib/supabase.js'

const user = ref(null)
const loading = ref(true)
const error = ref('')

async function init() {
  loading.value = true
  try {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
  } catch {
    user.value = null
  } finally {
    loading.value = false
  }
}

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null
})

async function signUp(email, password) {
  error.value = ''
  const { data, error: err } = await supabase.auth.signUp({ email, password })
  if (err) { error.value = err.message; return null }
  if (data.user && !data.session) {
    error.value = '注册成功！请检查邮箱中的确认链接，或已自动登录。'
  }
  return data
}

async function signIn(email, password) {
  error.value = ''
  const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
  if (err) { error.value = err.message; return null }
  return data
}

async function signInWithOAuth(provider) {
  error.value = ''
  const { error: err } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin }
  })
  if (err) { error.value = err.message }
}

async function signOut() {
  error.value = ''
  const { error: err } = await supabase.auth.signOut()
  if (err) { error.value = err.message }
}

function clearError() {
  error.value = ''
}

export function useAuth() {
  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    init,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    clearError
  }
}
