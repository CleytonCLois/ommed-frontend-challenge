import {
  createGrpcClient,
  getAuthMetadata,
  setToken,
  clearToken,
  createUserRequest,
  createLoginRequest,
  createEmptyRequest,
  createAddCouncilRequest,
  createDeleteCouncilRequest,
  createGetFullUserInfoRequest,
  createGetRegistryRequest,
  createDeleteUserRequest,
  parseLoginResponse,
  parseBasicInformationResponse,
  parseFullUserInfoResponse,
  parseListCouncilsResponse,
  parseListProfessionsResponse,
  parseGetRegistryResponse,
  parseGenericResponse,
} from '../grpc/grpcClient.js'

// === AUTH SERVICE ===
export const grpcAuthService = {
  async createUser(userData) {
    try {
      const client = await createGrpcClient()
      const request = await createUserRequest(userData)
      
      const response = await client.createUser(request, {})
      
      return {
        success: response.getSuccess(),
        data: response.getData(),
        message: response.getMessage(),
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw new Error(error.message || 'Erro ao criar usuário')
    }
  },

  async login(email, password) {
    try {
      console.log('📡 Iniciando login via gRPC...')
      console.log('📡 URL do servidor:', import.meta.env.VITE_GRPC_URL || "https://development-api.beta.ommed.tech:50051")
      
      const client = await createGrpcClient()
      console.log('✅ Cliente criado')
      
      const request = await createLoginRequest(email, password)
      console.log('✅ Request criado')
      console.log('📤 Enviando request para login...')
      
      const response = await client.login(request, {})
      console.log('✅ Resposta recebida:', response)
      
      const result = parseLoginResponse(response)
      
      if (result.success && result.data) {
        let token = null
        try {
          if (typeof result.data === 'string') {
            const parsed = JSON.parse(result.data)
            token = parsed.token || parsed
          } else if (typeof result.data === 'object' && result.data.token) {
            token = result.data.token
          } else {
            token = result.data
          }
          
          if (token) {
            setToken(token)
          }
        } catch (e) {
          token = result.data
          if (token) {
            setToken(token)
          }
        }
        
        return {
          success: true,
          token: token,
          message: result.message,
        }
      }
      
      return {
        success: false,
        token: null,
        message: result.message || 'Erro ao realizar login',
      }
    } catch (error) {
      console.error('Erro no login:', error)
      throw new Error(error.message || 'Erro ao realizar login')
    }
  },

  async getBasicInformation(token) {
    try {
      const client = await createGrpcClient()
      const request = await createEmptyRequest()
      const metadata = getAuthMetadata(token)
      
      const response = await client.listBasicInformation(request, metadata)
      const result = parseBasicInformationResponse(response)
      
      // Garantir que DDI tenha o prefixo +
      if (result.data && result.data.ddi) {
        const ddiValue = result.data.ddi.trim()
        if (ddiValue && !ddiValue.startsWith('+')) {
          result.data.ddi = `+${ddiValue}`
        }
      }
      
      return result
    } catch (error) {
      console.error('Erro ao buscar informações básicas:', error)
      throw new Error(error.message || 'Erro ao buscar informações básicas')
    }
  },

  async getFullUserInfo(token) {
    try {
      const client = await createGrpcClient()
      const request = await createGetFullUserInfoRequest()
      const metadata = getAuthMetadata(token)
      
      const response = await client.getFullUserInfo(request, metadata)
      return parseFullUserInfoResponse(response)
    } catch (error) {
      console.error('Erro ao buscar informações completas:', error)
      throw new Error(error.message || 'Erro ao buscar informações completas')
    }
  },

  async deleteUser(email, dateBirth, token) {
    try {
      const client = await createGrpcClient()
      const request = await createDeleteUserRequest(email, dateBirth)
      const metadata = getAuthMetadata(token)
      
      const response = await client.deleteUser(request, metadata)
      return parseGenericResponse(response)
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw new Error(error.message || 'Erro ao deletar usuário')
    }
  },

  logout() {
    clearToken()
  },

  handleError(error) {
    return {
      message: error.message || 'Erro ao processar requisição',
      code: error.code,
      details: error.details,
    }
  },
}

// === PROFESSION SERVICE ===
export const grpcProfessionService = {
  async listProfessions(token) {
    try {
      const client = await createGrpcClient()
      const request = await createEmptyRequest()
      const metadata = getAuthMetadata(token)
      
      const response = await client.listProfessions(request, metadata)
      return parseListProfessionsResponse(response)
    } catch (error) {
      console.error('Erro ao listar profissões:', error)
      throw new Error(error.message || 'Erro ao listar profissões')
    }
  },

  async listCouncils(token) {
    try {
      const client = await createGrpcClient()
      const request = await createEmptyRequest()
      const metadata = getAuthMetadata(token)
      
      const response = await client.listCouncils(request, metadata)
      return parseListCouncilsResponse(response)
    } catch (error) {
      console.error('Erro ao listar conselhos:', error)
      throw new Error(error.message || 'Erro ao listar conselhos')
    }
  },

  async getRegistry(number, state, token) {
    try {
      const client = await createGrpcClient()
      const request = await createGetRegistryRequest(number, state)
      const metadata = getAuthMetadata(token)
      
      const response = await client.getRegistry(request, metadata)
      return parseGetRegistryResponse(response)
    } catch (error) {
      console.error('Erro ao buscar registro:', error)
      return {
        success: false,
        message: error.message || 'Registro não encontrado',
      }
    }
  },

  async addCouncil(councilData, token) {
    try {
      const client = await createGrpcClient()
      const request = await createAddCouncilRequest(councilData)
      const metadata = getAuthMetadata(token)
      
      const response = await client.addCouncil(request, metadata)
      return parseGenericResponse(response)
    } catch (error) {
      console.error('Erro ao adicionar conselho:', error)
      throw new Error(error.message || 'Erro ao adicionar conselho')
    }
  },

  async deleteCouncil(councilId, token) {
    try {
      const client = await createGrpcClient()
      const request = await createDeleteCouncilRequest(councilId)
      const metadata = getAuthMetadata(token)
      
      const response = await client.deleteCouncil(request, metadata)
      return parseGenericResponse(response)
    } catch (error) {
      console.error('Erro ao deletar conselho:', error)
      throw new Error(error.message || 'Erro ao deletar conselho')
    }
  },
}