import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CLAVE_SESION } from '../config/constantes'
import type { LoginResponse, SesionGuardada, Rol } from '../interfaces/auth'
import { AuthContext } from './authContextBase'

const normalizarRol = (rolCrudo: any): Rol => {
  // 1. Imprimimos en la consola exactamente lo que llega
  console.log('🚨 ROL DETECTADO DESDE EL BACKEND:', rolCrudo)

  const valor = String(rolCrudo).toLowerCase()
  
  // Posibles combinaciones de ID numérico (Ajusta estos números si en consola ves otros)
  if (valor === '1') return 'Administrador'
  if (valor === '2') return 'Técnico'
  if (valor === '3') return 'Cliente'
  
  // Posibles cadenas de texto (por si el backend ya lo manda como texto)
  if (valor.includes('admin')) return 'Administrador'
  if (valor.includes('tec') || valor.includes('téc')) return 'Técnico'
  if (valor.includes('cli')) return 'Cliente'
  
  return 'Cliente'
}

const leerSesionGuardada = (): SesionGuardada | null => {
  try {
    const texto = localStorage.getItem(CLAVE_SESION)
    if (!texto) return null

    const sesion = JSON.parse(texto) as SesionGuardada
    if (new Date(sesion.expiracion).getTime() <= Date.now()) {
      localStorage.removeItem(CLAVE_SESION)
      return null
    }

    if (sesion.usuario) {
      sesion.usuario.rol = normalizarRol(sesion.usuario.rol)
    }

    return sesion
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<SesionGuardada | null>(leerSesionGuardada)

  const guardarSesion = useCallback((respuesta: any) => {
    // 2. Buscamos el rol en todas sus posibles escrituras desde C#
    const rolCapturado = respuesta.rol ?? respuesta.Rol ?? respuesta.role ?? respuesta.idRol ?? respuesta.roleId;

    console.log('📦 RESPUESTA COMPLETA DEL LOGIN:', respuesta);

    const nuevaSesion: SesionGuardada = {
      token: respuesta.token,
      expiracion: respuesta.expiracion,
      usuario: {
        id: respuesta.id,
        nombreCompleto: respuesta.nombreCompleto,
        email: respuesta.email,
        rol: normalizarRol(rolCapturado), // Enviamos lo capturado
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