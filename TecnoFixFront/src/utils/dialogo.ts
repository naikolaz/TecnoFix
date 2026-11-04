import Swal from 'sweetalert2';

interface ConfirmationOptions {
  title?: string;
  titulo?: string;
  message?: string;
  mensaje?: string;
  confirmButtonText?: string;
  textoBotonConfirmar?: string;
  cancelButtonText?: string;
  textoBotonCancelar?: string;
}

export const showConfirmationDialog = async ({
  title,
  titulo = '¿Confirmar Acción?',
  message,
  mensaje,
  confirmButtonText,
  textoBotonConfirmar = 'Sí, continuar',
  cancelButtonText,
  textoBotonCancelar = 'Cancelar'
}: ConfirmationOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title: title ?? titulo,
    text: message ?? mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0056b3', // TecnoFix primary color
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmButtonText ?? textoBotonConfirmar,
    cancelButtonText: cancelButtonText ?? textoBotonCancelar,
    reverseButtons: true,
    focusCancel: true
  });

  return result.isConfirmed;
};

export const showSuccessDialog = (title: string, message?: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonColor: '#0056b3'
  });
};

export const showErrorDialog = (title: string, message?: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonColor: '#0056b3'
  });
};

// Aliases for compatibility
export const mostrarConfirmacion = showConfirmationDialog;
export const mostrarExito = showSuccessDialog;
export const mostrarError = showErrorDialog;
