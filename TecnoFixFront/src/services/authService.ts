import api from '../config/api'
import type { LoginRequest, LoginResponse } from '../interfaces/auth'

export const iniciarSesion = async (datos: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email: datos.email.trim(),
    password: datos.password,
  })
  return data
}
