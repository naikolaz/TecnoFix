import { createContext } from 'react'
import type { LoginResponse, UserSession } from '../interfaces/auth'

export interface AuthContextValue {
  user: UserSession | null
  usuario: UserSession | null
  token: string | null
  isAuthenticated: boolean
  estaAutenticado: boolean
  saveSession: (response: LoginResponse) => void
  guardarSesion: (respuesta: LoginResponse) => void
  logout: () => void
  cerrarSesion: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
