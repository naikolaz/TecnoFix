export const SESSION_STORAGE_KEY = 'tecnofix_sesion';
export const CLAVE_SESION = SESSION_STORAGE_KEY;

export const LOGIN_MESSAGES = {
  emptyEmail: 'Debe completar el campo Correo electrónico',
  invalidEmail: 'El correo electrónico no tiene un formato válido',
  emptyPassword: 'Debe completar el campo Contraseña',
  invalidCredentials: 'Correo electrónico o contraseña incorrectos',
  networkError: 'No fue posible conectar con el servidor. Intente nuevamente.',
} as const;

export const MENSAJES_LOGIN = {
  emailVacio: LOGIN_MESSAGES.emptyEmail,
  emailInvalido: LOGIN_MESSAGES.invalidEmail,
  passwordVacia: LOGIN_MESSAGES.emptyPassword,
  credencialesIncorrectas: LOGIN_MESSAGES.invalidCredentials,
  sinConexion: LOGIN_MESSAGES.networkError,
} as const;
