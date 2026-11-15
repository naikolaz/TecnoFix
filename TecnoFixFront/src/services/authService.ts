import api from '../config/api'
import type { LoginRequest, LoginResponse } from '../interfaces/auth'
import { getErrorMessage } from '../utils/errores'

export interface ClientOption {
  id: number
  name: string
  nombreCompleto?: string
  email: string
  rut?: string
  telephoneNumber?: string
}

export type ClienteOpcion = ClientOption

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email: credentials.email.trim(),
    password: credentials.password,
  })
  return data
}

export const registerTechnician = async (technicianData: { 
  nombreCompleto: string; 
  email: string; 
  especialidad: string 
}) => {
  try {
    const { data } = await api.post('/auth/registrar-tecnico', technicianData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClients = async (): Promise<ClientOption[]> => {
  const { data } = await api.get<ClientOption[]>('/auth/clientes');
  return data;
};

// Aliases
export const iniciarSesion = login;
export const registrarTecnico = registerTechnician;
export const obtenerClientes = getClients;
