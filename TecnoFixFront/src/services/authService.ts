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
    try {
        const { data } = await api.post('/auth/registrar-tecnico', datosTecnico);
        return data;
    } catch (error: any) {
        // Buscamos si el backend envió nuestro mensaje personalizado dentro de error.response.data.error
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        // Si el error es otro (ej. se apagó el servidor backend), lanzamos uno genérico
        throw new Error("Ocurrió un error inesperado al comunicarse con el servidor.");
    }
};
