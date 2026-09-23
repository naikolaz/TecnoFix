import { createContext } from 'react'
import type { LoginResponse, UsuarioSesion } from '../interfaces/auth'

export interface AuthContextValue {
  usuario: UsuarioSesion | null
  token: string | null
  estaAutenticado: boolean
  guardarSesion: (respuesta: LoginResponse) => void
  cerrarSesion: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
