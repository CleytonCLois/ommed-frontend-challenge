<template>
  <div class="council-card">
    <div class="council-header">
      <div class="council-info">
        <h4 class="council-name">{{ council.professionalName }}</h4>
        <p class="council-details">
          {{ council.description }} - {{ council.number }} - {{ council.state }}
        </p>
      </div>
      
      <div class="council-actions">
        <button type="button" class="options-button" @click="toggleMenu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
            <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        
        <div v-if="showMenu" class="dropdown-menu">
          <button type="button" @click="handleDelete" class="delete-option">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="menu-icon">
              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Excluir
          </button>
        </div>
      </div>
    </div>

    <div v-if="council.specialities && council.specialities.length > 0" class="specialities-list">
      <div v-for="(speciality, index) in council.specialities" :key="index" class="speciality-item">
        <div class="speciality-row">
          <span class="speciality-label">{{ speciality.description }}</span>
          <span class="speciality-value">{{ speciality.rqeNumber }}</span>
        </div>
        
        <div v-if="speciality.actuations && speciality.actuations.length > 0" class="actuations-list">
          <div v-for="(actuation, actIndex) in speciality.actuations" :key="actIndex" class="actuation-item">
            <div class="actuation-row">
              <span class="actuation-label">{{ actuation.description }}</span>
              <span class="actuation-value">{{ actuation.rqeNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  council: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleDelete = () => {
  showMenu.value = false
  emit('delete', props.council.councilId)
}
</script>

<style scoped>
.council-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.council-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.council-info {
  flex: 1;
}

.council-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.council-details {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.council-actions {
  position: relative;
}

.options-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.options-button:hover {
  background-color: #f5f5f5;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  margin-top: 4px;
  overflow: hidden;
  z-index: 100;
}

.dropdown-menu button {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

.dropdown-menu button.delete-option {
  color: #dc3545;
}

.dropdown-menu button.delete-option:hover {
  background-color: #fff5f5;
}

.menu-icon {
  flex-shrink: 0;
}

.specialities-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.speciality-item {
  margin-bottom: 12px;
}

.speciality-item:last-child {
  margin-bottom: 0;
}

.speciality-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.speciality-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.speciality-value {
  font-size: 14px;
  color: #666;
}

.actuations-list {
  margin-left: 24px;
  margin-top: 8px;
}

.actuation-item {
  margin-bottom: 8px;
}

.actuation-item:last-child {
  margin-bottom: 0;
}

.actuation-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.actuation-label {
  font-size: 13px;
  color: #555;
}

.actuation-value {
  font-size: 13px;
  color: #666;
}
</style>