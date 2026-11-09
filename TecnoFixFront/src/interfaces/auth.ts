export type Role = 'Administrador' | 'Técnico' | 'Cliente'
export type Rol = Role

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiracion: string
  id: number
  name?: string
  nombreCompleto?: string
  email: string
  role?: string
  rol?: string | Role
  idRole?: number
}

export interface UserSession {
  id: number
  fullName: string
  nombreCompleto: string
  email: string
  role: Role
  rol: Role
}

export type UsuarioSesion = UserSession

export interface SavedSession {
  token: string
  expiration: string
  expiracion: string
  user: UserSession
  usuario: UserSession
}

export type SesionGuardada = SavedSession
