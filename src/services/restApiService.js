import api from './api.js'

export const restAuthService = {
  async createUser(userData) {
    const cleanPhone = userData.phone ? String(userData.phone).replace(/\D/g, '') : ''
    let dateBirth = userData.dateBirth || ''
    
    if (dateBirth) {
      if (dateBirth.includes('/')) {
        const [day, month, year] = dateBirth.split('/')
        if (day && month && year) {
          dateBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
      } else if (dateBirth.includes('T') || dateBirth.length >= 10) {
        dateBirth = dateBirth.slice(0, 10)
      }
    }
    
    const payload = {
      firstName: String(userData.firstName || '').trim(),
      lastName: String(userData.lastName || '').trim(),
      dateBirth,
      ddi: userData.ddi || '+55',
      phone: cleanPhone,
      email: String(userData.email || '').trim(),
      password: String(userData.password || ''),
    }
    
    const response = await api.post('/api/auth/register', payload, { skipAuth: true })
    
    return {
      success: response.success,
      data: response.data,
      message: response.message,
    }
  },

  async login(email, password) {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    }, { skipAuth: true })
    
    let token = null
    if (response.success && response.data) {
      try {
        if (typeof response.data === 'string') {
          const parsed = JSON.parse(response.data)
          token = parsed.token || parsed
        } else if (typeof response.data === 'object' && response.data.token) {
          token = response.data.token
        } else {
          token = response.data
        }
        
        if (token) {
          api.setToken(token)
        }
      } catch (e) {
        token = response.data
        if (token) {
          api.setToken(token)
        }
      }
    }
    
    return {
      success: response.success,
      token: token,
      message: response.message,
    }
  },

  async getBasicInformation(token) {
    const response = await api.get('/api/auth/me')
    
    let userInfo = response.information || response.data || {}
    
    if (userInfo.ddi === undefined && userInfo.ddi_number !== undefined) {
      userInfo.ddi = userInfo.ddi_number
    }
    
    if (userInfo.ddi && typeof userInfo.ddi === 'string') {
      const ddiValue = userInfo.ddi.trim()
      if (ddiValue && !ddiValue.startsWith('+')) {
        userInfo.ddi = `+${ddiValue}`
      }
    }
    
    if (userInfo.firstName === undefined && userInfo.first_name !== undefined) {
      userInfo.firstName = userInfo.first_name
    }
    if (userInfo.lastName === undefined && userInfo.last_name !== undefined) {
      userInfo.lastName = userInfo.last_name
    }
    if (userInfo.dateBirth === undefined && userInfo.date_birth !== undefined) {
      userInfo.dateBirth = userInfo.date_birth
    }
    
    return {
      success: response.success,
      data: userInfo,
      message: response.message,
    }
  },

  async getFullUserInfo(token) {
    const response = await api.get('/api/auth/full')
    
    const user = response.user || response.data || {}
    const councils = (user.councils || []).map(council => ({
      councilId: council.councilId || council.council_id,
      userId: council.userId || council.user_id,
      professionalName: council.professionalName || council.professional_name,
      state: council.state,
      number: council.number,
      description: council.description,
      subscriptionType: council.subscriptionType || council.subscription_type,
      status: council.status,
      specialities: (council.specialities || []).map(spec => ({
        specialityId: spec.specialityId || spec.speciality_id,
        rqeNumber: spec.rqeNumber || spec.rqe_number,
        description: spec.description,
        actuations: (spec.actuations || []).map(act => ({
          actionActuationId: act.actionActuationId || act.action_actuation_id,
          specialityId: act.specialityId || act.speciality_id,
          rqeNumber: act.rqeNumber || act.rqe_number,
          description: act.description,
          exclusive: act.exclusive,
        })),
      })),
    }))
    
    return {
      success: response.success,
      data: {
        ...user,
        councils,
      },
      message: response.message,
    }
  },

  logout() {
    api.clearToken()
  },

  handleError(error) {
    return {
      message: error.message || 'Erro ao processar requisição',
      code: error.code,
      details: error.details,
    }
  },
}

export const restProfessionService = {
  async listProfessions(token) {
    const response = await api.get('/api/professions')
    const professions = response.professions || response.data || []
    
    return {
      success: response.success,
      data: professions,
      message: response.message,
    }
  },

  async listCouncils(token) {
    const response = await api.get('/api/councils')
    
    const registries = response.registries || response.data || []
    const councils = registries.map(council => ({
      councilId: council.councilId || council.council_id,
      userId: council.userId || council.user_id,
      professionalName: council.professionalName || council.professional_name,
      state: council.state,
      number: council.number,
      description: council.description,
      subscriptionType: council.subscriptionType || council.subscription_type,
      status: council.status,
      specialities: (council.specialities || []).map(spec => ({
        specialityId: spec.specialityId || spec.speciality_id,
        rqeNumber: spec.rqeNumber || spec.rqe_number,
        description: spec.description,
        actuations: (spec.actuations || []).map(act => ({
          actionActuationId: act.actionActuationId || act.action_actuation_id,
          specialityId: act.specialityId || act.speciality_id,
          rqeNumber: act.rqeNumber || act.rqe_number,
          description: act.description,
          exclusive: act.exclusive,
        })),
      })),
    }))
    
    return {
      success: response.success,
      data: councils,
      message: response.message,
    }
  },

  async getRegistry(number, state, token) {
    const response = await api.get(`/api/registry/${number}/${state}`)
    
    const registry = response.registry || response.data
    
    if (!response.success || !registry) {
      return {
        success: false,
        message: response.message || 'Registro não encontrado',
      }
    }
    
    const specialities = (registry.specialities || []).map(spec => ({
      specialityId: spec.specialityId || spec.speciality_id,
      rqeNumber: spec.rqeNumber || spec.rqe_number,
      description: spec.description,
      actuations: (spec.actuations || []).map(act => ({
        actionActuationId: act.actionActuationId || act.action_actuation_id,
        specialityId: act.specialityId || act.speciality_id,
        rqeNumber: act.rqeNumber || act.rqe_number,
        description: act.description,
        exclusive: act.exclusive,
      })),
    }))
    
    return {
      success: response.success,
      data: {
        state: registry.state,
        number: registry.number,
        professionalName: registry.professionalName || registry.professional_name,
        subscriptionType: registry.subscriptionType || registry.subscription_type,
        status: registry.status,
        specialities,
      },
      message: response.message,
    }
  },

  async addCouncil(councilData, token) {
    const requestData = {
      professionalName: councilData.professionalName,
      council: councilData.council,
      state: councilData.state,
      number: councilData.number.toString(),
      description: councilData.description,
    }
    
    if (councilData.subscriptionType) {
      requestData.subscriptionType = councilData.subscriptionType
    }
    if (councilData.status) {
      requestData.status = councilData.status
    }
    
    if (councilData.specialities && councilData.specialities.length > 0) {
      requestData.specialities = councilData.specialities.map(spec => {
        const speciality = {
          rqeNumber: spec.rqeNumber || '',
          description: spec.description || '',
          actuations: [],
        }
        
        if (spec.actuations && spec.actuations.length > 0) {
          speciality.actuations = spec.actuations
            .filter(act => act.description || act.rqeNumber)
            .map(act => {
              const actuation = {
                rqeNumber: act.rqeNumber || '',
                description: act.description || '',
              }
              const exclusiveValue = act.exclusive === true || act.exclusive === 1 || act.exclusive === '1' ? 1 : 0
              if (exclusiveValue === 1) {
                actuation.exclusive = 1
              }
              return actuation
            })
        }
        
        return speciality
      })
    }
    
    const response = await api.post('/api/councils', requestData)
    
    return {
      success: response.success,
      data: response.data,
      message: response.message,
    }
  },

  async deleteCouncil(councilId, token) {
    const response = await api.delete(`/api/councils/${councilId}`)
    
    return {
      success: response.success,
      data: response.data,
      message: response.message,
    }
  },
}