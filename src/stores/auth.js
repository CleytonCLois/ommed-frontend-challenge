import { defineStore } from 'pinia'
import { authService } from '../services/apiService'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || null
    return {
      token,
      isAuthenticated: !!token,
    }
  },

  actions: {
    async login(email, password) {
      try {
        const response = await authService.login(email, password)
        
        if (response.success && response.token) {
          this.token = response.token
          this.isAuthenticated = true
          return { success: true, message: response.message }
        } else {
          return { success: false, message: response.message || 'Erro ao realizar login' }
        }
      } catch (error) {
        return { success: false, message: error.message || 'Erro ao realizar login' }
      }
    },

    logout() {
      authService.logout()
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('token')
    },

    getToken() {
      return this.token
    },
  },
})