const GRPC_WEB_URL = "https://development-api.beta.ommed.tech:50051"

let TestF1ProtoServicePromiseClient = null
let protoClasses = null

async function initializeModules() {
  if (TestF1ProtoServicePromiseClient && protoClasses) return
  
  try {
    const grpcWebModule = await import('../grpc/testF1_grpc_web_pb.js')
    const protoModule = await import('../grpc/testF1_pb.js')
    
    const grpcModule = grpcWebModule.default || grpcWebModule
    TestF1ProtoServicePromiseClient = grpcModule.TestF1ProtoServicePromiseClient
    
    if (!TestF1ProtoServicePromiseClient) {
      throw new Error('TestF1ProtoServicePromiseClient not found. Available keys: ' + Object.keys(grpcModule || {}))
    }
    
    protoClasses = protoModule.default || protoModule
    
    if (!protoClasses) {
      throw new Error('Proto classes not found')
    }
  } catch (error) {
    throw error
  }
}

export async function createGrpcClient() {
  await initializeModules()
  return new TestF1ProtoServicePromiseClient(GRPC_WEB_URL, null, null)
}

export function getAuthMetadata(token) {
  if (!token) return {}
  return { 
    Authorization: `Bearer ${token}` 
  }
}

async function getProtoClass(className) {
  await initializeModules()
  const cls = protoClasses[className]
  if (!cls) {
    throw new Error(`Class ${className} not found. Available classes: ${Object.keys(protoClasses).slice(0, 20).join(', ')}`)
  }
  return cls
}

export async function createEmptyRequest() {
  const EmptyRequest = await getProtoClass('EmptyRequest')
  return new EmptyRequest()
}

export async function createUserRequest(userData) {
  const CreateUserRequest = await getProtoClass('CreateUserRequest')
  const request = new CreateUserRequest()
  
  request.setFirstName(userData.firstName)
  request.setLastName(userData.lastName)
  request.setDateBirth(userData.dateBirth)
  request.setDdi(userData.ddi)
  request.setPhone(userData.phone)
  request.setEmail(userData.email)
  request.setPassword(userData.password)
  
  return request
}

export async function createLoginRequest(email, password) {
  const LoginRequest = await getProtoClass('LoginRequest')
  const request = new LoginRequest()
  
  request.setEmail(email)
  request.setPassword(password)
  
  return request
}

export async function createAddCouncilRequest(councilData) {
  const AddCouncilRequest = await getProtoClass('AddCouncilRequest')
  const SpecialityProto = await getProtoClass('SpecialityProto')
  const ActionActuationProto = await getProtoClass('ActionActuationProto')
  
  const request = new AddCouncilRequest()
  request.setProfessionalName(councilData.professionalName)
  request.setCouncil(councilData.council)
  request.setState(councilData.state)
  request.setNumber(councilData.number.toString())
  request.setDescription(councilData.description)
  
  if (councilData.subscriptionType) {
    request.setSubscriptionType(councilData.subscriptionType)
  }
  if (councilData.status) {
    request.setStatus(councilData.status)
  }
  
  if (councilData.specialities && councilData.specialities.length > 0) {
    const specialitiesList = councilData.specialities.map(spec => {
      const speciality = new SpecialityProto()
      speciality.setRqeNumber(spec.rqeNumber || '')
      speciality.setDescription(spec.description || '')
      
      if (spec.actuations && spec.actuations.length > 0) {
        const actuationsList = spec.actuations.map(act => {
          const actuation = new ActionActuationProto()
          actuation.setRqeNumber(act.rqeNumber || '')
          actuation.setDescription(act.description || '')
          actuation.setExclusive(act.exclusive || 0)
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
  const DeleteCouncilRequest = await getProtoClass('DeleteCouncilRequest')
  const request = new DeleteCouncilRequest()
  request.setCouncilId(councilId)
  return request
}

export async function createGetFullUserInfoRequest() {
  const GetFullUserInfoRequest = await getProtoClass('GetFullUserInfoRequest')
  return new GetFullUserInfoRequest()
}

export async function createGetRegistryRequest(number, state) {
  const GetRegistryRequest = await getProtoClass('GetRegistryRequest')
  const request = new GetRegistryRequest()
  request.setNumber(parseInt(number))
  request.setState(state)
  return request
}