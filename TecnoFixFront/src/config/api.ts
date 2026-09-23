import axios from 'axios'
import { CLAVE_SESION } from './constantes'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5199/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const sesionGuardada = localStorage.getItem(CLAVE_SESION)
  if (sesionGuardada) {
    const { token } = JSON.parse(sesionGuardada) as { token: string }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem(CLAVE_SESION)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
