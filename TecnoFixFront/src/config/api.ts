import axios from 'axios'
import { SESSION_STORAGE_KEY } from './constantes'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5199/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY)
  if (savedSession) {
    const { token } = JSON.parse(savedSession) as { token: string }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
