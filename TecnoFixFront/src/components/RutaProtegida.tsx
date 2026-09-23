import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { Rol } from '../interfaces/auth'

interface RutaProtegidaProps {
  rolesPermitidos?: Rol[]
}

function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { estaAutenticado, usuario } = useAuth()
  const ubicacion = useLocation()

  if (!estaAutenticado || !usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/inicio" replace />
  }

  return <Outlet />
}

export default RutaProtegida
