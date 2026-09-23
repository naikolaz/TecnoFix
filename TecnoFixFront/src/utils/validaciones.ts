const FORMATO_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const esEmailValido = (email: string): boolean => FORMATO_EMAIL.test(email.trim())

export const estaVacio = (valor: string): boolean => valor.trim().length === 0
