import { isAxiosError } from 'axios'
import { MENSAJES_LOGIN } from '../config/constantes'

interface RespuestaError {
  error?: string
  message?: string
  errors?: Record<string, string[]>
}

export const obtenerMensajeError = (error: unknown): string => {
  if (!isAxiosError<RespuestaError>(error)) return 'Ocurrió un error inesperado.'
  if (!error.response) return MENSAJES_LOGIN.sinConexion

  const datos = error.response.data
  if (datos?.error) return datos.error
  if (datos?.errors) return Object.values(datos.errors).flat()[0] ?? 'Datos inválidos.'
  if (datos?.message) return datos.message

  return 'Ocurrió un error inesperado.'
}
