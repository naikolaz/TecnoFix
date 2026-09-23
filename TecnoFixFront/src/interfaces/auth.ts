export type Rol = 'Administrador' | 'Técnico' | 'Cliente'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiracion: string
  id: number
  nombreCompleto: string
  email: string
  rol: Rol
}

export interface UsuarioSesion {
  id: number
  nombreCompleto: string
  email: string
  rol: Rol
}

export interface SesionGuardada {
  token: string
  expiracion: string
  usuario: UsuarioSesion
}
