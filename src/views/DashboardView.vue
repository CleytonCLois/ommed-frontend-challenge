<template>
  <div class="dashboard-container">
    <header class="header" :class="{ 'blurred': showDeleteModal }">
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
        <button @click="handleLogout" class="logout-button">
          Sair
        </button>
      </div>
    </header>

    <div class="dashboard-content" :class="{ 'blurred': showDeleteModal }">
      <div v-if="userStore.loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else class="content-wrapper">
        <!-- Dados Pessoais -->
        <section class="section">
          <h2 class="section-main-title">Dados pessoais</h2>
          
          <div class="section-card">
            <div class="section-header">
              <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#ff7043"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#ff7043" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="section-icon-plus">+</span>
              <h3 class="section-title">Informações</h3>
            </div>
            
            <div v-if="userStore.userInfo">
              <div class="form-row">
              <div class="form-group">
                <input
                    v-model="userStore.userInfo.firstName"
                  type="text"
                  class="input"
                />
                  <label class="floating-label label-floated">Nome *</label>
              </div>

              <div class="form-group">
                <input
                    v-model="userStore.userInfo.lastName"
                  type="text"
                  class="input"
                />
                  <label class="floating-label" :class="{ 'label-floated': userStore.userInfo.lastName }">Sobrenome</label>
              </div>
            </div>

              <div class="form-row form-row-triple">
              <div class="form-group">
                <input
                    v-model="userStore.userInfo.dateBirth"
                  type="text"
                  class="input"
                    maxlength="10"
                    :ref="el => dateBirthInput = el"
                    @focus="handleInputFocus"
                    @blur="handleInputBlur"
                    @input="formatDateInput"
                  />
                  <label 
                    class="floating-label"
                    :class="{ 'label-floated': userStore.userInfo.dateBirth || dateBirthFocused }"
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
                        v-model="userStore.userInfo.ddi" 
                        class="ddi-select-inline"
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
                        v-model="userStore.userInfo.phone"
                        type="tel"
                        class="input phone-input-inline"
                        :ref="el => phoneInput = el"
                        @focus="handlePhoneFocus"
                        @blur="handlePhoneBlur"
                        @input="formatPhoneInput"
                      />
                      <label 
                        class="floating-label phone-label"
                        :class="{ 'label-floated': userStore.userInfo.phone || phoneFocused }"
                      >
                        Telefone *
                      </label>
                    </div>
                </div>
              </div>

              <div class="form-group">
                <input
                    v-model="userStore.userInfo.email"
                  type="email"
                  class="input"
                />
                  <label class="floating-label label-floated">Email *</label>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Profissão -->
        <section class="section">
          <h2 class="section-main-title">Profissão</h2>
          
          <div class="section-card">
            <div class="section-header">
              <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#ff7043"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#ff7043" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="section-icon-plus">+</span>
              <h3 class="section-title">Profissões</h3>
              <div v-if="hasRegistryData" class="section-actions">
                <button type="button" class="options-button" @click="toggleProfessionsMenu">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                <div v-if="showProfessionsMenu" class="dropdown-menu">
                  <button type="button" @click="handleDeleteProfessions" class="delete-option">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="menu-icon">
                      <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Excluir
              </button>
                </div>
              </div>
            </div>

            <!-- Formulário de adicionar profissão (sempre visível) -->
            <AddCouncilForm
              ref="addCouncilFormRef"
              :professions="userStore.professions"
              @close="handleCloseForm"
              @registry-loaded="handleRegistryLoaded"
              @council-added="handleCouncilAdded"
            />

            <!-- Lista de conselhos existentes -->
            <div v-if="userStore.councils && userStore.councils.length > 0" class="councils-list">
              <CouncilCard
                v-for="council in userStore.councils"
                :key="council.councilId"
                :council="council"
                @delete="handleDeleteCouncil"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Mensagens de alerta -->
      <div v-if="alertMessage" :class="['alert', alertType]" @click="alertMessage = ''">
        {{ alertMessage }}
      </div>
    </div>

    <!-- Modal de Exclusão -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-card">
        <div class="delete-icon-container">
          <div class="delete-icon-circle">
            <svg class="delete-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="10" y1="11" x2="10" y2="17" stroke="#dc3545" stroke-width="2" stroke-linecap="round"/>
              <line x1="14" y1="11" x2="14" y2="17" stroke="#dc3545" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <h3 class="modal-title">{{ deleteModalTitle }}</h3>
        <p class="modal-message">{{ deleteModalMessage }}</p>
        <div class="modal-buttons">
          <button @click="showDeleteModal = false" class="modal-button-cancel">
            Cancelar
          </button>
          <button @click="confirmDelete" class="modal-button-confirm">
            Confirmar exclusão
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { authService, professionService } from '../services/apiService'
import AddCouncilForm from '../components/AddCouncilForm.vue'
import CouncilCard from '../components/CouncilCard.vue'
import logoOmmed from '../assets/images/Ommed.svg'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const selectedLanguage = ref('PT-BR')
const alertMessage = ref('')
const alertType = ref('')
const showProfessionsMenu = ref(false)
const hasRegistryData = ref(false)
const phoneFocused = ref(false)
const phoneInput = ref(null)
const dateBirthFocused = ref(false)
const dateBirthInput = ref(null)
const addCouncilFormRef = ref(null)
const showDeleteModal = ref(false)
const deleteModalTitle = ref('')
const deleteModalMessage = ref('')
const councilToDelete = ref(null) // Para armazenar o councilId que será excluído
const deleteAllMode = ref(false) // Indica se está excluindo todos ou um só

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

const selectedCountry = ref(
  countries.value.find(c => c.ddi === (userStore.userInfo?.ddi || '+55')) || countries.value[0]
)

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
watch(() => userStore.userInfo?.ddi, (newDdi) => {
  if (newDdi) {
    selectedCountry.value = countries.value.find(c => c.ddi === newDdi) || countries.value[0]
  }
})

// Formatação de data DD/MM/AAAA
const formatDateInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length <= 2) {
    userStore.userInfo.dateBirth = value
  } else if (value.length <= 4) {
    userStore.userInfo.dateBirth = value.slice(0, 2) + '/' + value.slice(2)
  } else {
    userStore.userInfo.dateBirth = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8)
  }
}

// Formatação de telefone (11) 9 7623-8674
const formatPhoneInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length <= 2) {
    userStore.userInfo.phone = value ? `(${value}` : ''
  } else if (value.length <= 7) {
    userStore.userInfo.phone = `(${value.slice(0, 2)}) ${value.slice(2)}`
  } else if (value.length <= 10) {
    userStore.userInfo.phone = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`
  } else {
    userStore.userInfo.phone = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`
  }
}

const handleInputFocus = (e) => {
  e.target.style.borderColor = '#999'
  const input = e.target
  if (input === dateBirthInput.value) {
    dateBirthFocused.value = true
  }
}

const handleInputBlur = (e) => {
  e.target.style.borderColor = '#ddd'
  const input = e.target
  if (input === dateBirthInput.value) {
    dateBirthFocused.value = false
  }
}

const handlePhoneFocus = (e) => {
  const phoneContainer = e.target.closest('.phone-input-unified')
  if (phoneContainer) {
    phoneContainer.style.borderColor = '#999'
  }
  phoneFocused.value = true
}

const handlePhoneBlur = (e) => {
  const phoneContainer = e.target.closest('.phone-input-unified')
  if (phoneContainer) {
    phoneContainer.style.borderColor = '#ddd'
  }
  phoneFocused.value = false
}

const toggleProfessionsMenu = () => {
  showProfessionsMenu.value = !showProfessionsMenu.value
}

const handleDeleteProfessions = () => {
  showProfessionsMenu.value = false
  
  if (!userStore.councils || userStore.councils.length === 0) {
    showAlert('Nenhum conselho para excluir', 'info')
    return
  }
  
  const count = userStore.councils.length
  councilToDelete.value = null
  deleteAllMode.value = true
  deleteModalTitle.value = 'Excluir todos os conselhos profissionais'
  deleteModalMessage.value = `Tem certeza que deseja excluir todos os ${count} conselho(s) profissional(is)? Esta ação não pode ser desfeita.`
  showDeleteModal.value = true
}

const handleRegistryLoaded = (loaded) => {
  hasRegistryData.value = loaded
}

const handleCouncilAdded = async (message) => {
  showAlert(message || 'Conselho adicionado com sucesso!', 'success')
  // Recarregar lista de conselhos
  await loadCouncils()
}

const handleDeleteCouncil = (councilId) => {
  councilToDelete.value = councilId
  deleteAllMode.value = false
  deleteModalTitle.value = 'Excluir conselho profissional'
  deleteModalMessage.value = 'Tem certeza que deseja excluir este conselho profissional? Esta ação não pode ser desfeita.'
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  showDeleteModal.value = false
  
  if (deleteAllMode.value) {
    // Lógica de exclusão em massa já está no handleDeleteProfessions
    await handleDeleteProfessionsConfirm()
  } else {
    // Excluir conselho individual
    const councilId = councilToDelete.value
    if (!councilId) return
    
    const result = await userStore.deleteCouncil(councilId)
    if (result.success) {
      showAlert(result.message || 'Conselho removido com sucesso!', 'success')
      await loadCouncils()
    } else {
      showAlert(result.message || 'Erro ao remover conselho', 'error')
    }
  }
  
  // Limpar referências
  councilToDelete.value = null
  deleteAllMode.value = false
}

const handleDeleteProfessionsConfirm = async () => {
  if (!userStore.councils || userStore.councils.length === 0) {
    showAlert('Nenhum conselho para excluir', 'info')
    return
  }
  
  // Excluir todos os conselhos em cascata
  try {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    
    if (!token) {
      showAlert('Token não encontrado', 'error')
      return
    }
    
    const count = userStore.councils.length
    // Excluir todos os conselhos sequencialmente
    const deletePromises = userStore.councils.map(council => 
      professionService.deleteCouncil(council.councilId, token)
    )
    
    const results = await Promise.allSettled(deletePromises)
    
    // Verifica se todos foram excluídos com sucesso
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
    
    if (failed.length === 0) {
      showAlert(`${count} conselho(s) excluído(s) com sucesso!`, 'success')
      // Recarregar lista de conselhos (que agora deve estar vazia)
      userStore.councils = []
    } else {
      showAlert(`Alguns conselhos não puderam ser excluídos. ${count - failed.length} de ${count} excluído(s).`, 'error')
      // Recarregar lista para atualizar o estado
      await loadCouncils()
    }
  } catch (error) {
    showAlert(`Erro ao excluir conselhos: ${error.message}`, 'error')
  }
}


const showAlert = (message, type = 'success') => {
  alertMessage.value = message
  alertType.value = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info'
  setTimeout(() => {
    alertMessage.value = ''
  }, 5000)
}

// Determina qual fase usar (pode ser configurado via variável de ambiente ou estado)
const usePhase2 = ref(false) // Altere para true para usar Fase 2

onMounted(async () => {
  await loadUserData()
  await userStore.loadProfessions()
  await loadCouncils()
  // Inicializa o país selecionado após carregar dados
  if (userStore.userInfo?.ddi) {
    selectedCountry.value = countries.value.find(c => c.ddi === userStore.userInfo.ddi) || countries.value[0]
  }
})

const loadUserData = async () => {
  const authStore = useAuthStore()
  const token = authStore.getToken()
  if (token) {
    const response = await authService.getBasicInformation(token)
    if (response.success) {
      userStore.userInfo = response.data
      // Formatar data de ISO (1990-01-15) para DD/MM/AAAA
      if (userStore.userInfo.dateBirth) {
        try {
          const date = new Date(userStore.userInfo.dateBirth)
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            userStore.userInfo.dateBirth = `${day}/${month}/${year}`
          }
        } catch {
          // Se não conseguir formatar, mantém o valor original
        }
      }
      // Normaliza o DDI para garantir formato "+XX" e atualiza o país selecionado
      if (userStore.userInfo?.ddi) {
        const ddiValue = String(userStore.userInfo.ddi).trim()
        if (ddiValue && !ddiValue.startsWith('+')) {
          userStore.userInfo.ddi = `+${ddiValue}`
        }
        selectedCountry.value = countries.value.find(c => c.ddi === userStore.userInfo.ddi) || countries.value[0]
      } else {
        // Se não houver DDI, define padrão
        userStore.userInfo.ddi = '+55'
        selectedCountry.value = countries.value[0]
      }
    }
  }
}

const loadCouncils = async () => {
  const authStore = useAuthStore()
  const token = authStore.getToken()
  if (token) {
    const response = await professionService.listCouncils(token)
    if (response.success) {
      userStore.councils = response.data || []
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const handleLogout = () => {
  authStore.logout()
  userStore.clearUserData()
  router.push('/login')
}

const handleCloseForm = () => {
  // Formulário sempre visível, então não faz nada
}

</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

/* Header */
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

.logout-button {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.logout-button:hover {
  color: #ff7043;
}

.dashboard-content {
  flex: 1;
  padding: 40px 0;
  background-color: #ffffff;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;
}

.section {
  margin-bottom: 40px;
}

.section-main-title {
  font-size: 24px;
  font-weight: 600;
  color: #ff7043;
  margin: 0 0 20px 0;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  margin-top: 12px;
  padding-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -16px;
  right: -16px;
  height: 1px;
  background-color: #f0f0f0;
}

.section-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.section-icon-plus {
  color: #ff7043;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  margin-left: -4px;
}

.section-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.section-actions {
  position: relative;
  margin-left: auto;
}

.options-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;
}

.options-button:hover {
  color: #333;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 140px;
  margin-top: 4px;
  overflow: hidden;
}

.dropdown-menu button {
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s;
}

.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

.dropdown-menu button.delete-option {
  color: #d32f2f;
}

.dropdown-menu button.delete-option:hover {
  background-color: #ffebee;
}

.menu-icon {
  flex-shrink: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}

.form-row-triple {
  grid-template-columns: 1fr 1fr 1fr;
}

.form-group {
  position: relative;
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

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
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

.input:disabled + .floating-label {
  background-color: #f5f5f5;
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
  width: 100%;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  color: #333;
  font-family: inherit;
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

.ddi-select-inline:focus {
  outline: none;
}

.councils-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff7043;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Alertas */
.alert {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

/* Blur effect when modal is open */
.blurred {
  filter: blur(4px);
  pointer-events: none;
}

/* Modal de Exclusão */
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
  z-index: 2000;
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

.delete-icon-container {
  margin-bottom: 24px;
}

.delete-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #f8d7da;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.delete-icon {
  color: #dc3545;
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

.modal-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

.modal-button-cancel {
  flex: 1;
  padding: 13px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.modal-button-cancel:hover {
  background-color: #e8e8e8;
}

.modal-button-confirm {
  flex: 1;
  padding: 13px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.modal-button-confirm:hover {
  background-color: #c82333;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row,
  .form-row-triple {
    grid-template-columns: 1fr;
  }
  
  .header {
    padding: 20px;
  }

  .content-wrapper {
    padding: 0 20px;
  }

  .section-card {
    padding: 24px 16px;
  }
}
</style>
