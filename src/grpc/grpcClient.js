const GRPC_WEB_URL = import.meta.env.VITE_GRPC_URL || 
  "http://development-api.beta.ommed.tech:50051"
const AUTH_TOKEN_KEY = 'auth_token'

let TestF1ProtoServicePromiseClient = null
let proto = null
let isInitialized = false
let initPromise = null

function setupRequirePolyfill() {
  if (typeof window.require !== 'undefined') return
  
  const modules = {}
  
  window.require = function(moduleName) {
    if (modules[moduleName]) {
      return modules[moduleName]
    }
    
    if (moduleName === 'google-protobuf') {
      if (window.jspb) {
        modules[moduleName] = window.jspb
        return window.jspb
      }
      throw new Error('google-protobuf não está carregado. Instale: npm install google-protobuf')
    }
    
    if (moduleName === 'grpc-web') {
      if (window.grpc && window.grpc.web) {
        modules[moduleName] = window.grpc.web
        return window.grpc.web
      }
      throw new Error('grpc-web não está carregado. Instale: npm install grpc-web')
    }
    
    if (moduleName === './testF1_pb.js' || moduleName === './testF1_pb') {
      if (window.proto && window.proto.testF1Api) {
        const protoModule = {
          testF1Api: window.proto.testF1Api,
          ...window.proto.testF1Api
        }
        modules[moduleName] = protoModule
        return protoModule
      }
      throw new Error('testF1_pb.js não foi carregado ainda')
    }
    
    console.warn(`Módulo ${moduleName} não encontrado, retornando objeto vazio`)
    modules[moduleName] = {}
    return modules[moduleName]
  }
  
  window.module = { exports: {} }
  window.exports = window.module.exports
}

async function loadDependencies() {
  const promises = []
  
  if (!window.jspb) {
    promises.push(
      import('google-protobuf')
        .then(jspb => {
          window.jspb = jspb
        })
        .catch(error => {
          console.error('Erro ao carregar google-protobuf:', error)
          throw new Error('google-protobuf não pode ser carregado. Execute: npm install google-protobuf')
        })
    )
  }
  
  if (!window.grpc || !window.grpc.web) {
    promises.push(
      import('grpc-web')
        .then(grpcWeb => {
          if (!window.grpc) window.grpc = {}
          window.grpc.web = grpcWeb.grpc || grpcWeb
        })
        .catch(error => {
          console.error('Erro ao carregar grpc-web:', error)
          throw new Error('grpc-web não pode ser carregado. Execute: npm install grpc-web')
        })
    )
  }
  
  await Promise.all(promises)
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

async function initializeModules() {
  if (isInitialized) return
  if (initPromise) return initPromise
  
  initPromise = (async () => {
    try {
      setupRequirePolyfill()
      await loadDependencies()
      
      window.module = { exports: {} }
      window.exports = window.module.exports
      
      await loadScript('/src/grpc/testF1_pb.js')
      const protoExports = window.module.exports
      
      window.module = { exports: {} }
      window.exports = window.module.exports
      
      await loadScript('/src/grpc/testF1_grpc_web_pb.js')
      const grpcExports = window.module.exports
      
      if (protoExports.testF1Api) {
        proto = protoExports.testF1Api
      } else if (window.proto && window.proto.testF1Api) {
        proto = window.proto.testF1Api
      } else {
        throw new Error('Proto classes não foram carregadas')
      }
      
      if (window.proto && window.proto.TestF1ProtoServicePromiseClient) {
        TestF1ProtoServicePromiseClient = window.proto.TestF1ProtoServicePromiseClient
      } else if (grpcExports.testF1Api && grpcExports.testF1Api.TestF1ProtoServicePromiseClient) {
        TestF1ProtoServicePromiseClient = grpcExports.testF1Api.TestF1ProtoServicePromiseClient
      } else if (proto.TestF1ProtoServicePromiseClient) {
        TestF1ProtoServicePromiseClient = proto.TestF1ProtoServicePromiseClient
      } else if (window.proto && window.proto.testF1Api && window.proto.testF1Api.TestF1ProtoServicePromiseClient) {
        TestF1ProtoServicePromiseClient = window.proto.testF1Api.TestF1ProtoServicePromiseClient
      } else if (grpcExports.TestF1ProtoServicePromiseClient) {
        TestF1ProtoServicePromiseClient = grpcExports.TestF1ProtoServicePromiseClient
      } else if (window.module && window.module.exports && window.module.exports.testF1Api) {
        const moduleExports = window.module.exports.testF1Api
        if (moduleExports.TestF1ProtoServicePromiseClient) {
          TestF1ProtoServicePromiseClient = moduleExports.TestF1ProtoServicePromiseClient
        }
      } else {
        throw new Error('TestF1ProtoServicePromiseClient não encontrado')
      }
      
      if (!TestF1ProtoServicePromiseClient) {
        throw new Error('TestF1ProtoServicePromiseClient ainda é null após todas as verificações')
      }
      
      isInitialized = true
      
    } catch (error) {
      console.error('Erro ao inicializar módulos gRPC:', error)
      throw error
    }
  })()
  
  return initPromise
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY) || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('token')
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem('token', token)
  sessionStorage.setItem('token', token)
}

export function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

export async function createGrpcClient() {
  await initializeModules()
  return new TestF1ProtoServicePromiseClient(GRPC_WEB_URL, null, null)
}

export function getAuthMetadata(token = null) {
  const authToken = token || getToken()
  if (!authToken) return {}
  return { 
    'authorization': `Bearer ${authToken}` 
  }
}

export async function createEmptyRequest() {
  await initializeModules()
  return new proto.EmptyRequest()
}

export async function createUserRequest(userData) {
  await initializeModules()
  const request = new proto.CreateUserRequest()
  
  request.setFirstName(userData.firstName || '')
  request.setLastName(userData.lastName || '')
  request.setDateBirth(userData.dateBirth || '')
  request.setDdi(userData.ddi || '+55')
  request.setPhone(String(userData.phone || '').replace(/\D/g, ''))
  request.setEmail(userData.email || '')
  request.setPassword(userData.password || '')
  
  return request
}

export async function createLoginRequest(email, password) {
  await initializeModules()
  const request = new proto.LoginRequest()
  
  request.setEmail(email)
  request.setPassword(password)
  
  return request
}

export async function createAddCouncilRequest(councilData) {
  await initializeModules()
  const request = new proto.AddCouncilRequest()
  request.setProfessionalName(councilData.professionalName || '')
  request.setCouncil(councilData.council || '')
  request.setState(councilData.state || '')
  request.setNumber(String(councilData.number || ''))
  request.setDescription(councilData.description || '')
  
  if (councilData.subscriptionType) {
    request.setSubscriptionType(councilData.subscriptionType)
  }
  if (councilData.status) {
    request.setStatus(councilData.status)
  }
  
  if (councilData.specialities && councilData.specialities.length > 0) {
    const specialitiesList = councilData.specialities.map(spec => {
      const speciality = new proto.SpecialityProto()
      speciality.setRqeNumber(spec.rqeNumber || '')
      speciality.setDescription(spec.description || '')
      
      if (spec.actuations && spec.actuations.length > 0) {
        const actuationsList = spec.actuations.map(act => {
          const actuation = new proto.ActionActuationProto()
          actuation.setRqeNumber(act.rqeNumber || '')
          actuation.setDescription(act.description || '')
          actuation.setExclusive(act.exclusive ? 1 : 0)
          return actuation
        })
        speciality.setActuationsList(actuationsList)
      }
      
      return speciality
    })
    request.setSpecialitiesList(specialitiesList)
  }
  
  return request
}

export async function createDeleteCouncilRequest(councilId) {
  await initializeModules()
  const request = new proto.DeleteCouncilRequest()
  request.setCouncilId(councilId)
  return request
}

export async function createGetFullUserInfoRequest() {
  await initializeModules()
  return new proto.GetFullUserInfoRequest()
}

export async function createGetRegistryRequest(number, state) {
  await initializeModules()
  const request = new proto.GetRegistryRequest()
  request.setNumber(parseInt(number))
  request.setState(state)
  return request
}

export async function createDeleteUserRequest(email, dateBirth) {
  await initializeModules()
  const request = new proto.DeleteUserRequest()
  request.setEmail(email)
  request.setDateBirth(dateBirth)
  return request
}

export function parseLoginResponse(response) {
  return {
    success: response.getSuccess(),
    data: response.getData(),
    message: response.getMessage(),
  }
}

export function parseBasicInformationResponse(response) {
  const info = response.getInformation()
  if (!info) {
    return {
      success: response.getSuccess(),
      data: null,
      message: response.getMessage(),
    }
  }
  
  return {
    success: response.getSuccess(),
    data: {
      userId: info.getUserId(),
      firstName: info.getFirstName(),
      lastName: info.getLastName(),
      dateBirth: info.getDateBirth(),
      email: info.getEmail(),
      ddi: info.getDdi(),
      phone: info.getPhone(),
    },
    message: response.getMessage(),
  }
}

export function parseFullUserInfoResponse(response) {
  const user = response.getUser()
  if (!user) {
    return {
      success: response.getSuccess(),
      data: null,
      message: response.getMessage(),
    }
  }
  
  const councils = (user.getCouncilsList() || []).map(council => ({
    councilId: council.getCouncilId(),
    userId: council.getUserId(),
    professionalName: council.getProfessionalName(),
    state: council.getState(),
    number: council.getNumber(),
    description: council.getDescription(),
    subscriptionType: council.getSubscriptionType(),
    status: council.getStatus(),
    specialities: (council.getSpecialitiesList() || []).map(spec => ({
      specialityId: spec.getSpecialityId(),
      rqeNumber: spec.getRqeNumber(),
      description: spec.getDescription(),
      actuations: (spec.getActuationsList() || []).map(act => ({
        actionActuationId: act.getActionActuationId(),
        specialityId: act.getSpecialityId(),
        rqeNumber: act.getRqeNumber(),
        description: act.getDescription(),
        exclusive: act.getExclusive(),
      })),
    })),
  }))
  
  return {
    success: response.getSuccess(),
    data: {
      userId: user.getUserId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      dateBirth: user.getDateBirth(),
      email: user.getEmail(),
      ddi: user.getDdi(),
      phone: user.getPhone(),
      councils,
    },
    message: response.getMessage(),
  }
}

export function parseListCouncilsResponse(response) {
  const registries = (response.getRegistriesList() || []).map(council => ({
    councilId: council.getCouncilId(),
    userId: council.getUserId(),
    professionalName: council.getProfessionalName(),
    state: council.getState(),
    number: council.getNumber(),
    description: council.getDescription(),
    subscriptionType: council.getSubscriptionType(),
    status: council.getStatus(),
    specialities: (council.getSpecialitiesList() || []).map(spec => ({
      specialityId: spec.getSpecialityId(),
      rqeNumber: spec.getRqeNumber(),
      description: spec.getDescription(),
      actuations: (spec.getActuationsList() || []).map(act => ({
        actionActuationId: act.getActionActuationId(),
        specialityId: act.getSpecialityId(),
        rqeNumber: act.getRqeNumber(),
        description: act.getDescription(),
        exclusive: act.getExclusive(),
      })),
    })),
  }))
  
  return {
    success: response.getSuccess(),
    data: registries,
    message: response.getMessage(),
  }
}

export function parseListProfessionsResponse(response) {
  const professions = (response.getProfessionsList() || []).map(prof => ({
    profession: prof.getProfession(),
    councilDescription: prof.getCouncilDescription(),
    councilAcronym: prof.getCouncilAcronym(),
  }))
  
  return {
    success: response.getSuccess(),
    data: professions,
    message: response.getMessage(),
  }
}

export function parseGetRegistryResponse(response) {
  const registry = response.getRegistry()
  if (!registry) {
    return {
      success: response.getSuccess(),
      data: null,
      message: response.getMessage(),
    }
  }
  
  return {
    success: response.getSuccess(),
    data: {
      state: registry.getState(),
      number: registry.getNumber(),
      professionalName: registry.getProfessionalName(),
      subscriptionType: registry.getSubscriptionType(),
      status: registry.getStatus(),
      specialities: (registry.getSpecialitiesList() || []).map(spec => ({
        specialityId: spec.getSpecialityId(),
        rqeNumber: spec.getRqeNumber(),
        description: spec.getDescription(),
        actuations: (spec.getActuationsList() || []).map(act => ({
          actionActuationId: act.getActionActuationId(),
          specialityId: act.getSpecialityId(),
          rqeNumber: act.getRqeNumber(),
          description: act.getDescription(),
          exclusive: act.getExclusive(),
        })),
      })),
    },
    message: response.getMessage(),
  }
}

export function parseGenericResponse(response) {
  return {
    success: response.getSuccess(),
    data: response.getData(),
    message: response.getMessage(),
  }
}