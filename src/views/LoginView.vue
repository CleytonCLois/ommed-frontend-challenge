<template>
  <div class="login-page">
    <header class="header">
      <img :src="logoOmmed" alt="Ommed" class="logo" />
      
      <div class="header-actions">
        <div class="language-selector">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 20 14'%3E%3Crect width='20' height='14' fill='%23009b3a'/%3E%3Cpath d='M10 1 L18 7 L10 13 L2 7 Z' fill='%23fedd00'/%3E%3Ccircle cx='10' cy='7' r='2' fill='%23002776'/%3E%3C/svg%3E"
            alt="BR"
            class="flag-icon"
          />
          <span>{{ selectedLanguage }}</span>
          <span class="arrow">▼</span>
        </div>
        <router-link to="/register" class="register-link">
          Cadastre-se
        </router-link>
      </div>
    </header>

    <div class="content">
      <div class="login-container">
        <h2 class="title">Entrar em minha conta</h2>
        <p class="subtitle">
          Seja bem vindo! Digite seu e-mail e sua senha<br/>
          para acessar sua conta na Ommed!
        </p>

        <div v-if="alertMessage" :class="['alert', alertType]">
          {{ alertMessage }}
        </div>

        <div class="form-container">
          <div class="form-group">
            <input
              v-model="formData.email"
              type="email"
              class="input"
              ref="emailInput"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            />
            <label 
              class="floating-label"
              :class="{ 'label-floated': formData.email || emailFocused }"
            >
              Email
            </label>
          </div>

          <div class="form-group">
            <div class="password-wrapper">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="input"
                ref="passwordInput"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              />
              <label 
                class="floating-label"
                :class="{ 'label-floated': formData.password || passwordFocused }"
              >
                Senha *
              </label>
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <button
            @click="handleLogin"
            :disabled="loading || !isFormValid"
            class="login-button"
            :class="{ loading: loading, 'button-disabled': !isFormValid }"
          >
            <span v-if="loading" class="spinner"></span>
            <span v-else>Entrar na conta</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoOmmed from '../assets/images/Ommed.svg'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const alertMessage = ref('')
const alertType = ref('')
const selectedLanguage = ref('PT-BR')
const emailFocused = ref(false)
const passwordFocused = ref(false)

const isFormValid = computed(() => {
  return formData.value.email.length > 0 && formData.value.password.length > 0
})

const handleInputFocus = (e) => {
  e.target.style.borderColor = '#999'
  if (e.target.type === 'email') {
    emailFocused.value = true
  } else if (e.target.type === 'password' || e.target.type === 'text') {
    passwordFocused.value = true
  }
}

const handleInputBlur = (e) => {
  e.target.style.borderColor = '#ddd'
  if (e.target.type === 'email') {
    emailFocused.value = false
  } else if (e.target.type === 'password' || e.target.type === 'text') {
    passwordFocused.value = false
  }
}

const handleLogin = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  alertMessage.value = ''
  alertType.value = ''

  try {
    const result = await authStore.login(formData.value.email, formData.value.password)
    
    if (result.success) {
      alertMessage.value = 'Login realizado com sucesso!'
      alertType.value = 'success'
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      alertMessage.value = result.message || 'Erro ao realizar login'
      alertType.value = 'error'
    }
  } catch (error) {
    alertMessage.value = error.message || 'Erro ao realizar login'
    alertType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #ffffff;
}

.logo {
  height: 28px;
  width: auto;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  background-color: #fff;
}

.flag-icon {
  width: 18px;
  height: 13px;
}

.arrow {
  font-size: 10px;
  margin-left: 2px;
}

.register-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
}

.register-link:hover {
  color: #ff7043;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-container {
  max-width: 400px;
  width: 100%;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #2c2c2c;
  margin-bottom: 12px;
  text-align: center;
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
  line-height: 1.5;
  font-size: 14px;
  text-align: center;
}

.alert {
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.alert.success {
  background-color: #d4edda;
  color: #155724;
}

.alert.error {
  background-color: #f8d7da;
  color: #721c24;
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 18px;
  position: relative;
}

.form-group:last-of-type {
  margin-bottom: 24px;
}

.input {
  width: 100%;
  padding: 20px 14px 8px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  font-family: inherit;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .input {
  padding-right: 44px;
}

.floating-label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #999;
  transition: all 0.2s;
  pointer-events: none;
  background-color: #fff;
  padding: 0 2px;
}

.floating-label.label-floated {
  top: 6px;
  transform: translateY(0);
  font-size: 11px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  color: #999;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button {
  width: 100%;
  padding: 13px;
  background-color: #ff7043;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.login-button:not(:disabled):hover {
  background-color: #ff5722;
}

.login-button.button-disabled {
  background-color: #ffb3a0;
  cursor: not-allowed;
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>