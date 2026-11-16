const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim())

export const isEmpty = (value: string): boolean => value.trim().length === 0

export const RUT_FORMAT_MESSAGE = 'El RUT debe ingresarse sin puntos ni guion (ej.: 12345670K)'
export const RUT_INVALID_MESSAGE = 'El RUT ingresado no es válido.'

export const isValidRutFormat = (rut: string): boolean => /^[0-9]{7,8}[0-9Kk]$/.test(rut.trim())

export const isValidRut = (rut: string): boolean => {
  const cleanRut = rut.trim().toUpperCase()

  if (!isValidRutFormat(cleanRut)) return false

  const body = cleanRut.slice(0, -1)
  const inputDv = cleanRut.slice(-1)
  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = 11 - (sum % 11)
  const expectedDv = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)

  return inputDv === expectedDv
}

// Aliases
export const esEmailValido = isValidEmail
export const estaVacio = isEmpty
export const esRutValido = isValidRut
export const esFormatoRutValido = isValidRutFormat
