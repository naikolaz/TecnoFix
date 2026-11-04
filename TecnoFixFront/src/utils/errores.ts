import { isAxiosError } from 'axios'
import { LOGIN_MESSAGES } from '../config/constantes'

interface ErrorResponse {
  error?: string
  message?: string
  errors?: Record<string, string[]>
}

export const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError<ErrorResponse>(error)) return 'Ocurrió un error inesperado.'
  if (!error.response) return LOGIN_MESSAGES.networkError

  const data = error.response.data
  if (data?.error) return data.error
  if (data?.errors) return Object.values(data.errors).flat()[0] ?? 'Datos inválidos.'
  if (data?.message) return data.message

  return 'Ocurrió un error inesperado.'
}

export const obtenerMensajeError = getErrorMessage
