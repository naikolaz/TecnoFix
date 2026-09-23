import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CLAVE_SESION } from '../config/constantes'
import type { LoginResponse, SesionGuardada } from '../interfaces/auth'
import { AuthContext } from './authContextBase'

const leerSesionGuardada = (): SesionGuardada | null => {
  try {
    const texto = localStorage.getItem(CLAVE_SESION)
    if (!texto) return null

    const sesion = JSON.parse(texto) as SesionGuardada
    if (new Date(sesion.expiracion).getTime() <= Date.now()) {
      localStorage.removeItem(CLAVE_SESION)
      return null
    }
    return sesion
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<SesionGuardada | null>(leerSesionGuardada)

  const guardarSesion = useCallback((respuesta: LoginResponse) => {
    const nuevaSesion: SesionGuardada = {
      token: respuesta.token,
      expiracion: respuesta.expiracion,
      usuario: {
        id: respuesta.id,
        nombreCompleto: respuesta.nombreCompleto,
        email: respuesta.email,
        rol: respuesta.rol,
      },
    }
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion))
    setSesion(nuevaSesion)
  }, [])

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION)
    setSesion(null)
  }, [])

  const valor = useMemo(
    () => ({
      usuario: sesion?.usuario ?? null,
      token: sesion?.token ?? null,
      estaAutenticado: sesion !== null,
      guardarSesion,
      cerrarSesion,
    }),
    [sesion, guardarSesion, cerrarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
