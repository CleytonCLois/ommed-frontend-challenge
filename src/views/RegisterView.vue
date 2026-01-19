<template>
  <div class="register-page">
    <!-- Header fixo -->
    <header class="header" :class="{ 'blurred': showSuccessModal }">
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
        <router-link to="/login" class="login-link">
          Entrar
        </router-link>
      </div>
    </header>

    <!-- Conteúdo centralizado -->
    <div class="content" :class="{ 'blurred': showSuccessModal }">
      <div class="register-container">
        <h2 class="title">Crie sua conta Ommed!</h2>
        <p class="subtitle">
          Uma única conta Ommed é tudo o que precisa<br/>
          para acessar todos os nossos serviços.
        </p>

        <div v-if="alertMessage" :class="['alert', alertType]">
          {{ alertMessage }}
        </div>

        <div class="form-container">
          <form @submit.prevent="handleRegister">
            <!-- Nome e Sobrenome -->
            <div class="form-row">
              <div class="form-group">
                <input
                  v-model="form.firstName"
                  type="text"
                  class="input"
                  :ref="el => firstNameInput = el"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                  required
                />
                <label 
                  class="floating-label"
                  :class="{ 'label-floated': form.firstName || firstNameFocused }"
                >
                  Nome *
                </label>
              </div>

              <div class="form-group">
                <input
                  v-model="form.lastName"
                  type="text"
                  class="input"
                  :ref="el => lastNameInput = el"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                />
                <label 
                  class="floating-label"
                  :class="{ 'label-floated': form.lastName || lastNameFocused }"
                >
                  Sobrenome
                </label>
              </div>
            </div>

            <!-- Data de nascimento e Telefone -->
            <div class="form-row">
              <div class="form-group">
                <input
                  v-model="form.dateBirth"
                  type="text"
                  class="input"
                  maxlength="10"
                  :ref="el => dateBirthInput = el"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                  @input="formatDateInput"
                  required
                />
                <label 
                  class="floating-label"
                  :class="{ 'label-floated': form.dateBirth || dateBirthFocused }"
                >
                  Data de nascimento *
                </label>
              </div>

              <div class="form-group">
                <div class="phone-input-unified">
                  <div class="phone-prefix">
                    <img 
                      :src="getCountryFlagUrl(selectedCountry?.code)"
                      :alt="selectedCountry?.name"
                      class="country-flag-icon"
                    />
                    <select 
                      v-model="form.ddi" 
                      class="ddi-select-inline"
                      required
                      @change="updateSelectedCountry"
                    >
                      <option
                        v-for="country in countries"
                        :key="country.code"
                        :value="country.ddi"
                        :data-code="country.code"
                      >
                        {{ country.ddi }}
                      </option>
                    </select>
                  </div>
                  <div class="phone-separator"></div>
                  <div class="phone-input-section">
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="input phone-input-inline"
                      :ref="el => phoneInput = el"
                      @focus="handleInputFocus"
                      @blur="handleInputBlur"
                      @input="formatPhoneInput"
                      required
                    />
                    <label 
                      class="floating-label phone-label"
                      :class="{ 'label-floated': form.phone || phoneFocused }"
                    >
                      Telefone *
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Email e Senha -->
            <div class="form-row">
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  class="input"
                  :ref="el => emailInput = el"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                  required
                />
                <label 
                  class="floating-label"
                  :class="{ 'label-floated': form.email || emailFocused }"
                >
                  Email *
                </label>
              </div>

              <div class="form-group">
                <div class="password-wrapper">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="input"
                    :ref="el => passwordInput = el"
                    @focus="handleInputFocus"
                    @blur="handleInputBlur"
                    required
                  />
                  <label 
                    class="floating-label"
                    :class="{ 'label-floated': form.password || passwordFocused }"
                  >
                    Senha *
                  </label>
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                  >
                    <!-- Ícone de olho aberto -->
                    <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <!-- Ícone de olho fechado -->
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Botão de Cadastro -->
            <div class="button-container">
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="register-button"
                :class="{ loading: loading, 'button-disabled': !isFormValid }"
              >
                <span v-if="loading" class="spinner"></span>
                <span v-else>Criar conta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Sucesso -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="goToLogin">
      <div class="modal-card">
        <div class="success-icon-container">
          <div class="success-icon-circle">
            <svg class="success-check" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="#28a745" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <h3 class="modal-title">Sua conta foi criada !</h3>
        <p class="modal-message">Retorne para tela de login para poder acessa-la</p>
        <button @click="goToLogin" class="modal-button">
          Realizar login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/apiService'
import logoOmmed from '../assets/images/Ommed.svg'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  dateBirth: '',
  ddi: '+55',
  phone: '',
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const alertMessage = ref('')
const alertType = ref('')
const selectedLanguage = ref('PT-BR')
const showSuccessModal = ref(false)
const firstNameFocused = ref(false)
const lastNameFocused = ref(false)
const dateBirthFocused = ref(false)
const phoneFocused = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)

const firstNameInput = ref(null)
const lastNameInput = ref(null)
const dateBirthInput = ref(null)
const phoneInput = ref(null)
const emailInput = ref(null)
const passwordInput = ref(null)

// Lista de países com DDI e bandeiras
const countries = ref([
  { code: 'BR', name: 'Brasil', ddi: '+55' },
  { code: 'US', name: 'Estados Unidos', ddi: '+1' },
  { code: 'ES', name: 'Espanha', ddi: '+34' },
  { code: 'PT', name: 'Portugal', ddi: '+351' },
  { code: 'AR', name: 'Argentina', ddi: '+54' },
  { code: 'MX', name: 'México', ddi: '+52' },
  { code: 'CO', name: 'Colômbia', ddi: '+57' },
  { code: 'CL', name: 'Chile', ddi: '+56' },
  { code: 'PE', name: 'Peru', ddi: '+51' },
  { code: 'FR', name: 'França', ddi: '+33' },
  { code: 'DE', name: 'Alemanha', ddi: '+49' },
  { code: 'IT', name: 'Itália', ddi: '+39' },
  { code: 'GB', name: 'Reino Unido', ddi: '+44' },
  { code: 'CA', name: 'Canadá', ddi: '+1' },
  { code: 'AU', name: 'Austrália', ddi: '+61' },
])

const selectedCountry = ref(countries.value.find(c => c.ddi === form.value.ddi) || countries.value[0])

// Função para obter URL da bandeira usando flagcdn.com
const getCountryFlagUrl = (code) => {
  if (!code) return 'https://flagcdn.com/w20/br.png'
  return `https://flagcdn.com/w20/${code.toLowerCase()}.png`
}

// Atualiza o país selecionado quando o DDI muda
const updateSelectedCountry = (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex]
  const countryCode = selectedOption.getAttribute('data-code')
  selectedCountry.value = countries.value.find(c => c.code === countryCode) || countries.value[0]
}

// Observa mudanças no DDI para atualizar a bandeira
watch(() => form.value.ddi, (newDdi) => {
  selectedCountry.value = countries.value.find(c => c.ddi === newDdi) || countries.value[0]
})

// Inicializa o país selecionado
onMounted(() => {
  selectedCountry.value = countries.value.find(c => c.ddi === form.value.ddi) || countries.value[0]
})

// Formatação de data DD/MM/AAAA
const formatDateInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length <= 2) {
    form.value.dateBirth = value
  } else if (value.length <= 4) {
    form.value.dateBirth = value.slice(0, 2) + '/' + value.slice(2)
  } else {
    form.value.dateBirth = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8)
  }
}

// Formatação de telefone (11) 9 7623-8674
const formatPhoneInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length <= 2) {
    form.value.phone = value ? `(${value}` : ''
  } else if (value.length <= 7) {
    form.value.phone = `(${value.slice(0, 2)}) ${value.slice(2)}`
  } else if (value.length <= 10) {
    form.value.phone = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`
  } else {
    form.value.phone = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`
  }
}

const isFormValid = computed(() => {
  return form.value.firstName.length > 0 && 
         form.value.dateBirth.length > 0 && 
         form.value.phone.length > 0 && 
         form.value.email.length > 0 && 
         form.value.password.length > 0
})

const handleInputFocus = (e) => {
  if (e.target.classList.contains('phone-input-inline')) {
    const phoneContainer = e.target.closest('.phone-input-unified')
    if (phoneContainer) {
      phoneContainer.style.borderColor = '#999'
    }
  } else {
    e.target.style.borderColor = '#999'
  }
  
  const input = e.target
  if (input === firstNameInput.value) {
    firstNameFocused.value = true
  } else if (input === lastNameInput.value) {
    lastNameFocused.value = true
  } else if (input === dateBirthInput.value) {
    dateBirthFocused.value = true
  } else if (input === phoneInput.value) {
    phoneFocused.value = true
  } else if (input === emailInput.value) {
    emailFocused.value = true
  } else if (input === passwordInput.value) {
    passwordFocused.value = true
  }
}

const handleInputBlur = (e) => {
  if (e.target.classList.contains('phone-input-inline')) {
    const phoneContainer = e.target.closest('.phone-input-unified')
    if (phoneContainer) {
      phoneContainer.style.borderColor = '#ddd'
    }
  } else {
    e.target.style.borderColor = '#ddd'
  }
  
  const input = e.target
  if (input === firstNameInput.value) {
    firstNameFocused.value = false
  } else if (input === lastNameInput.value) {
    lastNameFocused.value = false
  } else if (input === dateBirthInput.value) {
    dateBirthFocused.value = false
  } else if (input === phoneInput.value) {
    phoneFocused.value = false
  } else if (input === emailInput.value) {
    emailFocused.value = false
  } else if (input === passwordInput.value) {
    passwordFocused.value = false
  }
}

const formatDateToISO = (dateString) => {
  // Converte de DD/MM/AAAA para ISO 8601
  if (!dateString) return ''
  
  // Se já estiver no formato ISO, retorna
  if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateString).toISOString()
  }
  
  // Converte DD/MM/AAAA para AAAA-MM-DD
  const parts = dateString.split('/')
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0')
    const month = parts[1].padStart(2, '0')
    const year = parts[2]
    const isoDate = `${year}-${month}-${day}`
    return new Date(isoDate).toISOString()
  }
  
  return ''
}

const goToLogin = () => {
  router.push('/login')
}

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  alertMessage.value = ''
  alertType.value = ''

  try {
    const userData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      dateBirth: formatDateToISO(form.value.dateBirth),
      ddi: form.value.ddi,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password,
    }

    const result = await authService.createUser(userData)
    
    if (result.success) {
      showSuccessModal.value = true
    } else {
      alertMessage.value = result.message || 'Erro ao criar conta'
      alertType.value = 'error'
    }
  } catch (error) {
    alertMessage.value = error.message || 'Erro ao criar conta'
    alertType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  position: relative;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #ffffff;
  transition: filter 0.3s ease;
}

.header.blurred {
  filter: blur(4px);
  pointer-events: none;
}

.logo {
  height: 40px;
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

.login-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
}

.login-link:hover {
  color: #ff7043;
}

/* Conteúdo */
.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  transition: filter 0.3s ease;
}

.content.blurred {
  filter: blur(4px);
  pointer-events: none;
}

.register-container {
  max-width: 800px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
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

/* Phone input unificado */
.phone-input-unified {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.2s;
  position: relative;
}

.phone-input-unified:focus-within {
  border-color: #999;
}

.phone-prefix {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 48px;
  box-sizing: border-box;
}

.country-flag-icon {
  width: 18px;
  height: 13px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.ddi-select-inline {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
  padding-right: 18px;
  padding-left: 0;
  min-width: 50px;
}

.phone-separator {
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
  flex-shrink: 0;
}

.phone-input-section {
  position: relative;
  flex: 1;
  height: 48px;
}

.phone-input-inline {
  border: none;
  padding: 20px 14px 8px 14px;
  height: 100%;
  border-radius: 0;
  background: transparent;
}

.phone-input-inline:focus {
  border-color: transparent;
  outline: none;
}

.phone-label {
  left: 14px;
  background-color: #fff;
}

.phone-input-inline:focus + .phone-label,
.phone-input-inline:not(:placeholder-shown) + .phone-label {
  background-color: #fff;
}

/* Ajuste para o select dentro do container */
.ddi-select-inline:focus {
  outline: none;
}

/* Password wrapper */
.password-wrapper {
  position: relative;
}

.password-wrapper .input {
  padding-right: 44px;
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

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.register-button {
  padding: 15px 220px;
  background-color: #ff7043;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
  width: auto;
  min-width: 200px;
}

.register-button:not(:disabled):hover {
  background-color: #ff5722;
}

.register-button.button-disabled {
  background-color: #ffb3a0;
  cursor: not-allowed;
}

.register-button:disabled {
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
  to {
    transform: rotate(360deg);
  }
}

/* Modal de Sucesso */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;
  pointer-events: all;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.success-icon-container {
  margin-bottom: 24px;
}

.success-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #d4edda;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.success-check {
  color: #28a745;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 12px 0;
}

.modal-message {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 32px 0;
}

.modal-button {
  width: 100%;
  padding: 13px;
  background-color: #ff7043;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.modal-button:hover {
  background-color: #ff5722;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .header {
    padding: 20px;
  }

  .modal-card {
    padding: 32px 24px;
    margin: 20px;
  }
}
</style>

