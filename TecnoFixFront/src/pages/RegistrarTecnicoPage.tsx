import { useState } from 'react';
import { registerTechnician } from '../services/authService';
import CampoFormulario from '../components/CampoFormulario';
import MensajeError from '../components/MensajeError';

export const RegistrarTecnicoPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [errors, setErrors] = useState({ name: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({ name: '', general: '' });

    if (!fullName.trim()) return setErrors(prev => ({ ...prev, general: 'Debe completar el campo Nombre Completo' }));
    if (!email.trim()) return setErrors(prev => ({ ...prev, general: 'Debe completar el campo Correo Electrónico' }));
    if (!specialty.trim()) return setErrors(prev => ({ ...prev, general: 'Debe completar el campo Especialidad' }));

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(fullName)) {
      setErrors(prev => ({ ...prev, name: 'El nombre solo puede contener letras y espacios' }));
      return;
    }
    setShowConfirmation(true);
  };

  const executeRegistration = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    try {
      await registerTechnician({ nombreCompleto: fullName, email, especialidad: specialty });
      setSuccessMessage('Técnico registrado exitosamente. La contraseña fue enviada a su correo.');
      setFullName('');
      setEmail('');
      setSpecialty('');
    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 1rem' }}>
      {/* TARJETA BLANCA ESTILO ORD-001/002 */}
      <div style={{ 
        background: 'var(--color-superficie, #ffffff)', 
        borderRadius: '12px', 
        padding: '36px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        width: '100%', 
        maxWidth: '500px',
      }}>
        
        {/* CABECERA CON TEXTO EN DEGRADADO Y ESTILO LIMPIO */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '1.5rem',
            background: 'linear-gradient(160deg, var(--color-primario) 0%, var(--color-secundario) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Registro de técnico
          </h2>
          <p style={{ margin: 0, color: 'var(--color-texto-suave, #666)', fontSize: '0.95rem' }}>
            Añade nuevos especialistas al sistema para que puedan diagnosticar reparaciones.
          </p>
        </div>

        {/* CUERPO DEL FORMULARIO */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
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

          {successMessage && (
            <div style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
              {successMessage}
            </div>
          )}
          
          <button type="submit" className="boton boton--primario boton--bloque" disabled={isLoading} style={{ marginTop: '8px' }}>
            {isLoading ? 'Registrando...' : 'Registrar Técnico'}
          </button>
        </form>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmation && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: 'var(--color-primario, #064789)', margin: '0 0 10px 0' }}>¿Confirmar registro?</h3>
            <p style={{ color: '#555', marginBottom: '24px' }}>¿Estás seguro de que deseas registrar a este técnico en el sistema?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" onClick={() => setShowConfirmation(false)} style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button type="button" onClick={executeRegistration} className="boton boton--primario">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarTecnicoPage;