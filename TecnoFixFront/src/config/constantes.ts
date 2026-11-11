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

export const BUDGET_MESSAGES = {
  notAvailable: 'El presupuesto no está disponible para su aprobación',
  noOrders: 'Aún no tiene órdenes de reparación registradas.',
  approveConfirmTitle: '¿Está seguro de aprobar el presupuesto?',
  approveConfirmText: 'La orden pasará al estado «En reparación». Esta decisión no se puede modificar.',
  approveSuccess: 'Presupuesto aprobado. La orden pasó al estado «En reparación».',
  rejectConfirmTitle: '¿Está seguro de rechazar el presupuesto?',
  rejectConfirmText:
    'La orden pasará al estado «Rechazada» y el equipo quedará disponible para retiro sin reparar. Esta decisión no se puede modificar.',
  rejectSuccess: 'Presupuesto rechazado. El equipo queda disponible para retiro sin reparar.',
  help: 'Al aprobar, la orden pasa a «En reparación». Al rechazar, pasa a «Rechazada» y el equipo queda disponible para retiro sin reparar. La decisión no se puede modificar.',
} as const;
