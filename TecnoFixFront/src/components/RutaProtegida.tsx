import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { Rol } from '../interfaces/auth'

interface RutaProtegidaProps {
  rolesPermitidos?: Rol[]
}

// Función auxiliar para normalizar cadenas (quita tildes y pasa a minúsculas)
const normalizarTexto = (texto: string = '') =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { estaAutenticado, usuario } = useAuth()
  const ubicacion = useLocation()

  if (!estaAutenticado || !usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rolUsuarioNormalizado = normalizarTexto(usuario.rol)

    const tienePermiso = rolesPermitidos.some(
      (rol) => normalizarTexto(rol) === rolUsuarioNormalizado
    )

    if (!tienePermiso) {
      return <Navigate to="/inicio" replace />
    }
  }

  return <Outlet />
}

export default RutaProtegida