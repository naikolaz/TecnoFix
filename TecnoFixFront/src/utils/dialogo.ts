import Swal from 'sweetalert2';

interface ConfirmarOptions {
  titulo?: string;
  mensaje: string;
  textoBotonConfirmar?: string;
  textoBotonCancelar?: string;
}

export const mostrarConfirmacion = async ({
  titulo = '¿Confirmar Acción?',
  mensaje,
  textoBotonConfirmar = 'Sí, continuar',
  textoBotonCancelar = 'Cancelar'
}: ConfirmarOptions): Promise<boolean> => {
  const resultado = await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0056b3', // Color primario de TecnoFix
    cancelButtonColor: '#6c757d',
    confirmButtonText: textoBotonConfirmar,
    cancelButtonText: textoBotonCancelar,
    reverseButtons: true,
    focusCancel: true
  });

  return resultado.isConfirmed;
};

export const mostrarExito = (titulo: string, mensaje?: string) => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'success',
    confirmButtonColor: '#0056b3'
  });
};

export const mostrarError = (titulo: string, mensaje?: string) => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'error',
    confirmButtonColor: '#0056b3'
  });
};