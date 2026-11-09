import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { SESSION_STORAGE_KEY } from '../config/constantes'
import type { LoginResponse, SavedSession, Role } from '../interfaces/auth'
import { AuthContext } from './authContextBase'

const normalizeRole = (rawRole: unknown): Role => {
  const value = String(rawRole ?? '').toLowerCase().trim()

  // DB Role ID mapping: 1 = Administrador, 2 = Cliente, 3 = Técnico
  if (value === '1') return 'Administrador'
  if (value === '2') return 'Cliente'
  if (value === '3') return 'Técnico'

  // Text matches
  if (value.includes('admin')) return 'Administrador'
  if (value.includes('tec') || value.includes('téc')) return 'Técnico'
  if (value.includes('cli')) return 'Cliente'

  return 'Cliente'
}

const readSavedSession = (): SavedSession | null => {
  try {
    const rawData = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!rawData) return null

    const session = JSON.parse(rawData) as SavedSession
    const expirationDate = session.expiration || session.expiracion
    if (new Date(expirationDate).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }

    const currentUser = session.user || session.usuario
    if (currentUser) {
      const normalized = normalizeRole(currentUser.role || currentUser.rol)
      currentUser.role = normalized
      currentUser.rol = normalized
      currentUser.fullName = currentUser.fullName || currentUser.nombreCompleto
      currentUser.nombreCompleto = currentUser.fullName
    }

    return session
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SavedSession | null>(readSavedSession)

  const saveSession = useCallback((response: LoginResponse) => {
    const capturedRole = response.rol ?? response.role ?? response.idRole
    const capturedName = response.nombreCompleto ?? response.name ?? ''
    const role = normalizeRole(capturedRole)

    const userSession = {
      id: response.id,
      fullName: capturedName,
      nombreCompleto: capturedName,
      email: response.email,
      role,
      rol: role,
    }

    const expirationString = response.expiracion

    const newSession: SavedSession = {
      token: response.token,
      expiration: expirationString,
      expiracion: expirationString,
      user: userSession,
      usuario: userSession,
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession))
    setSession(newSession)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setSession(null)
  }, [])

  const contextValue = useMemo(() => {
    const activeUser = session?.user ?? session?.usuario ?? null
    const isAuthenticated = session !== null

    return {
      user: activeUser,
      usuario: activeUser,
      token: session?.token ?? null,
      isAuthenticated,
      estaAutenticado: isAuthenticated,
      saveSession,
      guardarSesion: saveSession,
      logout,
      cerrarSesion: logout,
    }
  }, [session, saveSession, logout])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
