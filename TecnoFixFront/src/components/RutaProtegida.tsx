import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { Role } from '../interfaces/auth'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
  rolesPermitidos?: Role[]
}

const normalizeText = (text: string = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

function ProtectedRoute({ allowedRoles, rolesPermitidos }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  }

  const effectiveRoles = allowedRoles ?? rolesPermitidos

  if (effectiveRoles && effectiveRoles.length > 0) {
    const userRoleNormalized = normalizeText(user.role)

    const hasPermission = effectiveRoles.some(
      (role) => normalizeText(role) === userRoleNormalized
    )

    if (!hasPermission) {
      return <Navigate to="/inicio" replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute
