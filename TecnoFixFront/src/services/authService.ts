import api from '../config/api'
import type { LoginRequest, LoginResponse } from '../interfaces/auth'

export const iniciarSesion = async (datos: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email: datos.email.trim(),
    password: datos.password,
  })
  return data
}
export const registrarTecnico = async (datosTecnico: { nombreCompleto: string; email: string; especialidad: string }) => {
    const { data } = await api.post('/auth/registrar-tecnico', datosTecnico);
    return data;
};
