<template>
  <div class="add-council-form">
    <form class="council-form" @submit.prevent="handleSubmit">
      <div class="form-row form-row-quadruple">
        <div class="form-group">
          <input
            id="professionalName"
            v-model="form.professionalName"
            type="text"
            class="input"
            :ref="el => professionalNameInput = el"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @input="checkBasicFields"
            required
          />
          <label 
            class="floating-label"
            :class="{ 'label-floated': form.professionalName || professionalNameFocused }"
            for="professionalName"
          >
            Nome do profissional *
          </label>
        </div>

        <div class="form-group">
          <select
            id="profession"
            v-model="selectedProfession"
            class="input select-input"
            required
            @change="handleProfessionChange"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            :ref="el => professionInput = el"
          >
            <option value="" disabled></option>
            <option
              v-for="prof in professions"
              :key="prof.councilAcronym"
              :value="prof.councilAcronym"
            >
              {{ prof.profession }}
            </option>
          </select>
          <label 
            class="floating-label"
            :class="{ 'label-floated': selectedProfession || professionFocused }"
            for="profession"
          >
            Profissão *
          </label>
        </div>

        <div class="form-group">
          <input
            id="number"
            v-model.number="form.number"
            type="text"
            class="input"
            :ref="el => numberInput = el"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @input="checkBasicFields"
            required
          />
          <label 
            class="floating-label"
            :class="{ 'label-floated': form.number || numberFocused }"
            for="number"
          >
            Número *
          </label>
        </div>

        <div class="form-group">
          <select
            id="state"
            v-model="form.state"
            class="input select-input"
            required
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @change="checkBasicFields"
            :ref="el => stateInput = el"
          >
            <option value="" disabled></option>
            <option
              v-for="state in brazilianStates"
              :key="state"
              :value="state"
            >
              {{ state }}
            </option>
          </select>
          <label 
            class="floating-label"
            :class="{ 'label-floated': form.state || stateFocused }"
            for="state"
          >
            Estado *
          </label>
        </div>
      </div>

      <div v-if="checkingRegistry" class="progress-bar" :key="progressKey">
        <div class="progress-fill" :key="progressKey"></div>
      </div>

      <div v-if="isCRM || hasSpecialities" class="crm-fields">
        <div class="specialities-section">
          <div
            v-for="(speciality, index) in form.specialities"
            :key="index"
            class="speciality-item"
          >
            <div class="form-row-specialty">
              <div class="form-group specialty-group">
                <input
                  v-model="speciality.description"
                  type="text"
                  class="input"
                />
                <label class="floating-label label-floated">
                  Especialidade Médica
                </label>
              </div>

              <div class="form-group rqe-group">
                <input
                  v-model="speciality.rqeNumber"
                  type="text"
                  class="input"
                />
                <label class="floating-label label-floated">
                  Número RQE
                </label>
              </div>
            </div>

            <div v-if="speciality.actuations && speciality.actuations.length > 0" class="actuations-section">
              <div
                v-for="(actuation, actIndex) in speciality.actuations"
                :key="actIndex"
                class="actuation-item"
              >
                <div class="form-row-actuation">
                  <div class="form-group actuation-group">
                    <input
                      v-model="actuation.description"
                      type="text"
                      class="input"
                    />
                    <label class="floating-label label-floated">
                      Área de atuação
                    </label>
                  </div>

                  <div class="form-group rqe-group">
                    <input
                      v-model="actuation.rqeNumber"
                      type="text"
                      class="input"
                    />
                    <label class="floating-label label-floated">
                      Número RQE
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="registryError && checkingRegistry" class="alert alert-error">
        {{ registryError }}
      </div>
      <div v-else-if="registryError && !checkingRegistry && canSearchRegistry" class="alert" :class="getAlertClass()">
        {{ getAlertMessage() }}
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          @click="handleCancel" 
          class="cancel-button"
          :disabled="!areBasicFieldsFilled"
          :class="{ 'button-disabled': !areBasicFieldsFilled }"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="save-button"
          :disabled="loading || !canSubmit"
          :class="{ 'button-disabled': loading || !canSubmit }"
        >
          <span v-if="loading" class="spinner-small"></span>
          <span v-else>Salvar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '../stores/user'

const BRAZILIAN_STATES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

const props = defineProps({
  professions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'registry-loaded', 'council-added'])

const userStore = useUserStore()
const brazilianStates = ref(BRAZILIAN_STATES)

const form = ref({
  professionalName: '',
  council: '',
  state: '',
  number: '',
  description: '',
  subscriptionType: '',
  status: '',
  specialities: [
    {
      rqeNumber: '',
      description: '',
      actuations: [],
    },
  ],
})

const selectedProfession = ref('')
const checkingRegistry = ref(false)
const registryChecked = ref(false)
const registryError = ref('')
const loading = ref(false)
const progressKey = ref(0)
const showSpecialitiesFields = ref(false)

const professionalNameFocused = ref(false)
const professionFocused = ref(false)
const numberFocused = ref(false)
const stateFocused = ref(false)

const professionalNameInput = ref(null)
const professionInput = ref(null)
const numberInput = ref(null)
const stateInput = ref(null)

const isCRM = computed(() => selectedProfession.value === 'CRM')

const hasSpecialities = computed(() => {
  if (showSpecialitiesFields.value) return true
  return form.value.specialities && form.value.specialities.length > 0 && 
         form.value.specialities.some(spec => spec.description || spec.rqeNumber)
})

const selectedProfessionData = computed(() => {
  return props.professions.find(p => p.councilAcronym === selectedProfession.value)
})

const areBasicFieldsFilled = computed(() => {
  return !!(
    form.value.professionalName &&
    selectedProfession.value &&
    form.value.number &&
    form.value.state
  )
})

const canSearchRegistry = computed(() => {
  return !!(form.value.number && form.value.state)
})

const canSubmit = computed(() => {
  return areBasicFieldsFilled.value && !checkingRegistry.value
})

const handleInputFocus = (e) => {
  e.target.style.borderColor = '#999'
  const input = e.target
  if (input === professionalNameInput.value) {
    professionalNameFocused.value = true
  } else if (input === professionInput.value) {
    professionFocused.value = true
  } else if (input === numberInput.value) {
    numberFocused.value = true
  } else if (input === stateInput.value) {
    stateFocused.value = true
  }
}

const handleInputBlur = (e) => {
  e.target.style.borderColor = '#ddd'
  const input = e.target
  if (input === professionalNameInput.value) {
    professionalNameFocused.value = false
  } else if (input === professionInput.value) {
    professionFocused.value = false
  } else if (input === numberInput.value) {
    numberFocused.value = false
  } else if (input === stateInput.value) {
    stateFocused.value = false
  }
}

const checkBasicFields = async () => {
  if (canSearchRegistry.value) {
    await checkRegistry()
  }
}

watch([() => form.value.number, () => form.value.state], async () => {
  if (canSearchRegistry.value) {
    await checkRegistry()
  }
}, { debounce: 500 })

const handleProfessionChange = () => {
  const prof = selectedProfessionData.value
  if (prof) {
    form.value.council = prof.councilAcronym
    form.value.description = prof.profession
  }

  form.value.subscriptionType = ''
  form.value.status = ''
  form.value.specialities = [
    {
      rqeNumber: '',
      description: '',
      actuations: [],
    },
  ]
  registryChecked.value = false
  registryError.value = ''
  emit('registry-loaded', false)
}

const checkRegistry = async () => {
  if (!form.value.number || !form.value.state) return

  checkingRegistry.value = true
  registryError.value = ''
  registryChecked.value = false
  progressKey.value++
  
  const currentProfessionalName = form.value.professionalName
  form.value.subscriptionType = ''
  form.value.status = ''
  form.value.specialities = [
    {
      rqeNumber: '',
      description: '',
      actuations: [],
    },
  ]

  try {
    const number = parseInt(form.value.number)
    if (isNaN(number)) {
      registryError.value = 'Número do registro deve ser um número válido'
      checkingRegistry.value = false
      return
    }

    const result = await userStore.checkRegistry(number, form.value.state)

    if (result.success && result.data) {
      if (result.data.professionalName && !currentProfessionalName) {
        form.value.professionalName = result.data.professionalName
      }
      
      form.value.subscriptionType = result.data.subscriptionType || ''
      form.value.status = result.data.status || ''
      
      if (result.data.specialities && result.data.specialities.length > 0) {
        if (!selectedProfession.value) {
          const crmProfession = props.professions.find(p => p.councilAcronym === 'CRM')
          if (crmProfession) {
            selectedProfession.value = 'CRM'
            form.value.council = 'CRM'
            form.value.description = crmProfession.profession
          }
        }
        
        form.value.specialities = result.data.specialities.map(spec => ({
          rqeNumber: spec.rqeNumber || '',
          description: spec.description || '',
          actuations: (spec.actuations || []).map(act => ({
            rqeNumber: act.rqeNumber || '',
            description: act.description || '',
            exclusive: act.exclusive || 0,
          })),
        }))
      }

      registryChecked.value = true
      registryError.value = ''
      emit('registry-loaded', true)
    } else {
      registryError.value = result.message || 'Registro não encontrado. Você pode adicionar manualmente.'
      registryChecked.value = false
      emit('registry-loaded', false)
    }
  } catch (error) {
    registryError.value = error.message || 'Erro ao verificar registro. Você pode adicionar manualmente.'
    registryChecked.value = false
    emit('registry-loaded', false)
  } finally {
    checkingRegistry.value = false
  }
}

const handleCancel = () => {
  resetForm()
}

const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  loading.value = true
  
  try {
    const councilData = {
      professionalName: form.value.professionalName,
      council: form.value.council,
      state: form.value.state,
      number: form.value.number,
      description: form.value.description,
    }
    
    if (isCRM.value || hasSpecialities.value) {
      councilData.subscriptionType = form.value.subscriptionType
      councilData.status = form.value.status
      if (form.value.specialities && form.value.specialities.some(spec => spec.description || spec.rqeNumber)) {
        councilData.specialities = form.value.specialities
          .filter(spec => spec.description || spec.rqeNumber)
          .map(spec => {
            const cleanedSpec = {
              rqeNumber: spec.rqeNumber || '',
              description: spec.description || '',
              actuations: (spec.actuations || [])
                .filter(act => act.description || act.rqeNumber)
                .map(act => ({
                  rqeNumber: act.rqeNumber || '',
                  description: act.description || '',
                  exclusive: act.exclusive !== undefined ? (act.exclusive === true || act.exclusive === 1 || act.exclusive === '1' ? 1 : 0) : 0,
                })),
            }
            return cleanedSpec
          })
      }
    }
    
    const result = await userStore.addCouncil(councilData)
    
    if (result.success) {
      emit('council-added', result.message)
      resetForm()
    } else {
      const errorMessage = result.message || 'Erro ao adicionar conselho'
      if (errorMessage.includes('já foi incluso') || errorMessage.includes('Registro já foi incluso')) {
        registryError.value = 'Este registro já está incluso no usuário.'
        registryChecked.value = false
      } else {
        registryError.value = errorMessage
      }
    }
  } catch (error) {
    const errorMessage = error.message || 'Erro ao adicionar conselho'
    if (errorMessage.includes('já foi incluso') || errorMessage.includes('Registro já foi incluso') || errorMessage.includes('number: Registro já foi incluso')) {
      registryError.value = 'Este registro já está incluso no usuário.'
      registryChecked.value = false
    } else {
      registryError.value = errorMessage
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    professionalName: '',
    council: '',
    state: '',
    number: '',
    description: '',
    subscriptionType: '',
    status: '',
    specialities: [
      {
        rqeNumber: '',
        description: '',
        actuations: [],
      },
    ],
  }
  selectedProfession.value = ''
  registryChecked.value = false
  registryError.value = ''
  showSpecialitiesFields.value = false
  emit('registry-loaded', false)
}

const getAlertClass = () => {
  if (registryError.value && (registryError.value.includes('já foi incluso') || registryError.value.includes('Registro já foi incluso'))) {
    return 'alert-error'
  }
  return registryChecked.value ? 'alert-success' : 'alert-warning'
}

const getAlertMessage = () => {
  if (registryChecked.value && registryError.value && !registryError.value.includes('já foi incluso')) {
    return 'Registro encontrado e carregado com sucesso!'
  }
  return registryError.value
}
</script>

<style scoped>
.add-council-form {
  background: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 24px;
}

.council-form {
  margin-top: 0;
  width: 100%;
}

.form-group {
  margin-bottom: 18px;
  position: relative;
  width: 100%;
}

.form-row .form-group,
.form-row-quadruple .form-group,
.form-row-specialty .form-group,
.form-row-actuation .form-group {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  margin-bottom: 18px;
}

.form-row-quadruple {
  grid-template-columns: 7fr 3fr 3fr 3fr;
  gap: 4px;
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

.input.select-input {
  padding-right: 30px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
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

.progress-bar {
  width: 100%;
  height: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 18px;
  padding: 4px;
  box-sizing: border-box;
}

.progress-fill {
  height: 8px;
  background-color: #4a90e2;
  border-radius: 4px;
  animation: progress-load 15s linear forwards;
  width: 0%;
  margin: 0;
  transform: translateZ(0);
}

@keyframes progress-load {
  from { width: 0%; }
  to { width: 100%; }
}

.crm-fields {
  margin-top: 0;
  padding-top: 0;
}

.specialities-section {
  margin-top: 0;
  padding-top: 0;
  width: 100%;
}

.speciality-item {
  background: white;
  padding: 0;
  border-radius: 0;
  margin-bottom: 24px;
  border: none;
}

.speciality-item:last-child {
  margin-bottom: 0;
}

.form-row-specialty {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4px;
  margin-bottom: 0;
  width: 100%;
}

.specialty-group {
  margin-bottom: 0;
  width: 100%;
}

.rqe-group {
  margin-bottom: 0;
  width: 100%;
}

.form-row-specialty .rqe-group {
  width: 100%;
}

.actuations-section {
  margin-top: 8px;
  padding-top: 0;
  border-top: none;
  margin-left: 0;
  width: 100%;
}

.actuation-item {
  margin-bottom: 24px;
  margin-left: 0;
}

.actuation-item:last-child {
  margin-bottom: 0;
}

.form-row-actuation {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4px;
  margin-bottom: 0;
  width: 100%;
}

.form-row-actuation .rqe-group {
  width: 100%;
}

.actuation-group {
  padding-left: 40px;
  margin-bottom: 0;
  position: relative;
}

.actuation-group .floating-label {
  left: 54px;
}

.alert {
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.cancel-button:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.cancel-button.button-disabled,
.cancel-button:disabled {
  background-color: #f5f5f5;
  color: #bbb;
  cursor: not-allowed;
  opacity: 0.6;
}

.save-button {
  padding: 10px 20px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.save-button:not(:disabled):hover {
  background-color: #757575;
}

.save-button.button-disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.save-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner-small {
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