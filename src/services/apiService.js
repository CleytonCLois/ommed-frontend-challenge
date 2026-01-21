const USE_GRPC = import.meta.env.VITE_USE_GRPC !== 'false' // Padrão: usar gRPC

import { restAuthService, restProfessionService } from './restApiService'
import { grpcAuthService, grpcProfessionService } from './grpcApiService'

export const authService = USE_GRPC ? grpcAuthService : restAuthService
export const professionService = USE_GRPC ? grpcProfessionService : restProfessionService

export const API_TYPE = USE_GRPC ? 'gRPC-Web' : 'REST'
