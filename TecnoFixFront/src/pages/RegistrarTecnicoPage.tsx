import { useState } from 'react';
import { registerTechnician } from '../services/authService';
import CampoFormulario from '../components/CampoFormulario';
import MensajeError from '../components/MensajeError';
import { showConfirmationDialog, showSuccessDialog, showErrorDialog } from '../utils/dialogo';

export const RegistrarTecnicoPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [errors, setErrors] = useState({ name: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', general: '' });

    if (!fullName.trim()) return setErrors(prev => ({ ...prev, general: 'Debe completar el campo Nombre Completo' }));
    if (!email.trim()) return setErrors(prev => ({ ...prev, general: 'Debe completar el campo Correo Electrónico' }));
    if (!specialty.trim()) return setErrors(prev => ({ ...prev, general: 'Debe completar el campo Especialidad' }));

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    if (!nameRegex.test(fullName)) {
      setErrors(prev => ({ ...prev, name: 'El nombre solo puede contener letras y espacios' }));
      return;
    }

    const isConfirmed = await showConfirmationDialog({
      title: '¿Confirmar registro?',
      message: '¿Estás seguro de que deseas registrar a este técnico en el sistema?',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      await registerTechnician({ nombreCompleto: fullName, email, especialidad: specialty });
      showSuccessDialog('¡Técnico Registrado!', 'El técnico ha sido registrado. La contraseña temporal fue enviada a su correo.');
      setFullName('');
      setEmail('');
      setSpecialty('');
    } catch (error: any) {
      const message = error?.message ?? 'No fue posible registrar al técnico.';
      setErrors(prev => ({ ...prev, general: message }));
      showErrorDialog('Error al registrar', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* CONTENEDOR CON SOMBRA Y BORDE SUPERIOR DEGRADADO */
    <div style={{ position: 'relative', background: 'var(--color-superficie, #fff)', borderRadius: '14px', boxShadow: '0 10px 30px rgba(6, 71, 137, 0.12)', maxWidth: '900px', margin: '32px auto', overflow: 'hidden' }}>
      
      {/* LÍNEA SUPERIOR CON DEGRADADO */}
      <div style={{ height: '6px', width: '100%', background: 'linear-gradient(160deg, var(--color-primario, #064789) 0%, var(--color-secundario, #2563eb) 100%)' }} />
      
      <div style={{ padding: '32px 36px' }}>
        {/* TÍTULO EN AZUL EXACTO AL DE LAS ÓRDENES */}
        <h2 style={{ color: 'var(--color-primario, #064789)', margin: '0 0 8px 0', fontSize: '1.6rem' }}>Registrar Técnico</h2>
        <p style={{ color: 'var(--color-texto-suave, #666)', marginBottom: '24px' }}>
          Añade nuevos especialistas al sistema para que puedan diagnosticar reparaciones. Los campos con (*) son obligatorios.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
          
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre Completo *"
            type="text"
            placeholder="Ej: Ana López"
            value={fullName}
            error={errors.name}
            onChange={(e) => setFullName(e.target.value)}
          />
          <CampoFormulario
            id="email"
            etiqueta="Correo Electrónico *"
            type="email"
            placeholder="tecnico@tecnofix.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CampoFormulario
            id="especialidad"
            etiqueta="Especialidad *"
            type="text"
            placeholder="Ej: Reparación de placas base"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />

          <MensajeError mensaje={errors.general} />

          <button 
            type="submit" 
            disabled={isLoading}
            className="boton boton--primario" 
            style={{ 
              padding: '14px', 
              fontSize: '1.1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1 
            }}
          >
            {isLoading ? 'Registrando...' : 'Registrar Técnico'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarTecnicoPage;