const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim())

export const isEmpty = (value: string): boolean => value.trim().length === 0

// Aliases
export const esEmailValido = isValidEmail
export const estaVacio = isEmpty
