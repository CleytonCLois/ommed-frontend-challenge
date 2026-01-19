const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:3001' : ''
const AUTH_TOKEN_KEY = 'auth_token'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('token') || sessionStorage.getItem('token')
}

function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem('token', token)
  sessionStorage.setItem('token', token)
}

function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  const token = getToken()
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const config = {
    ...options,
    headers,
  }
  
  try {
    const response = await fetch(url, config)
    
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        data = { success: false, message: text }
      }
    }
    
    if (!response.ok) {
      if (response.status === 401) {
        clearToken()
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        throw new Error(data.message || 'Sessão expirada. Por favor, faça login novamente.')
      }
      
      let errorMessage = data.message || `Erro ${response.status}: ${response.statusText}`
      if (data.data && typeof data.data === 'string') {
        try {
          const errorDetails = JSON.parse(data.data)
          const errorFields = Object.keys(errorDetails)
          if (errorFields.length > 0) {
            const detailedMessages = errorFields.map(field => {
              const messages = Array.isArray(errorDetails[field]) ? errorDetails[field] : [errorDetails[field]]
              return `${field}: ${messages.join(', ')}`
            })
            errorMessage = `${errorMessage}\n${detailedMessages.join('\n')}`
          }
        } catch (e) {
          // Se não conseguir parsear, usa a mensagem original
        }
      }
      
      throw new Error(errorMessage)
    }
    
    return data
  } catch (error) {
    throw error
  }
}

export const api = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' })
  },
  
  post(endpoint, data, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  put(endpoint, data, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' })
  },
  
  getToken,
  setToken,
  clearToken,
}

export default api