import { defineStore } from 'pinia'
import { authService, professionService } from '../services/apiService'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    councils: [],
    professions: [],
    loading: false,
    error: null,
    phase: 'phase1',
  }),

  getters: {
    basicInfo(state) {
      if (!state.userInfo) return null
      return {
        userId: state.userInfo.userId,
        firstName: state.userInfo.firstName,
        lastName: state.userInfo.lastName,
        dateBirth: state.userInfo.dateBirth,
        email: state.userInfo.email,
        ddi: state.userInfo.ddi,
        phone: state.userInfo.phone,
      }
    },
  },

  actions: {
    async loadUserInfoPhase1() {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken()
        
        if (!token) {
          throw new Error('Token não encontrado')
        }

        const [basicInfoResponse, councilsResponse] = await Promise.all([
          authService.getBasicInformation(token),
          professionService.listCouncils(token),
        ])

        if (basicInfoResponse.success) {
          this.userInfo = basicInfoResponse.data
        }

        if (councilsResponse.success) {
          this.councils = councilsResponse.data || []
        }

        this.phase = 'phase1'
      } catch (error) {
        this.error = error.message || 'Erro ao carregar informações do usuário'
      } finally {
        this.loading = false
      }
    },

    async loadUserInfoPhase2() {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken()
        
        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await authService.getFullUserInfo(token)

        if (response.success && response.data) {
          this.userInfo = {
            userId: response.data.userId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            dateBirth: response.data.dateBirth,
            email: response.data.email,
            ddi: response.data.ddi,
            phone: response.data.phone,
          }
          this.councils = response.data.councils || []
        }

        this.phase = 'phase2'
      } catch (error) {
        this.error = error.message || 'Erro ao carregar informações do usuário'
      } finally {
        this.loading = false
      }
    },

    async loadProfessions() {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken()
        
        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await professionService.listProfessions(token)

        if (response.success) {
          this.professions = response.data || []
        }
      } catch (error) {
        this.professions = []
      }
    },

    async addCouncil(councilData) {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken()
        
        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await professionService.addCouncil(councilData, token)

        if (response.success) {
          if (this.phase === 'phase1') {
            await this.loadUserInfoPhase1()
          } else {
            await this.loadUserInfoPhase2()
          }
          return { success: true, message: response.message || 'Conselho adicionado com sucesso' }
        } else {
          return { success: false, message: response.message || 'Erro ao adicionar conselho' }
        }
      } catch (error) {
        return { success: false, message: error.message || 'Erro ao adicionar conselho' }
      }
    },

    async deleteCouncil(councilId) {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken()
        
        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await professionService.deleteCouncil(councilId, token)

        if (response.success) {
          if (this.phase === 'phase1') {
            await this.loadUserInfoPhase1()
          } else {
            await this.loadUserInfoPhase2()
          }
          return { success: true, message: response.message || 'Conselho removido com sucesso' }
        } else {
          return { success: false, message: response.message || 'Erro ao remover conselho' }
        }
      } catch (error) {
        return { success: false, message: error.message || 'Erro ao remover conselho' }
      }
    },

    async checkRegistry(number, state) {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken()
        
        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await professionService.getRegistry(number, state, token)
        return response
      } catch (error) {
        return { success: false, message: error.message || 'Erro ao consultar registro' }
      }
    },

    clearUserData() {
      this.userInfo = null
      this.councils = []
      this.professions = []
      this.error = null
    },
  },
})