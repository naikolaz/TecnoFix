import { useState } from 'react';
import { registerTechnician } from '../services/authService';
import CampoFormulario from '../components/CampoFormulario';
import MensajeError from '../components/MensajeError';
import './LoginPage.css';

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
      setSuccessMessage('Técnico registrado exitosamente.');
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
    <div className="login">
      <div className="login__panel" style={{ width: '100%' }}>
        <form className="login__tarjeta" onSubmit={handleSubmit} noValidate style={{ margin: '0 auto' }}>
          <h2>Registrar Nuevo Técnico</h2>
          <p className="login__subtitulo">Ingresa los datos para añadir un técnico al sistema.</p>

          <CampoFormulario
            id="nombre"
            etiqueta="Nombre Completo"
            type="text"
            value={fullName}
            error={errors.name}
            onChange={(e) => setFullName(e.target.value)}
          />
          <CampoFormulario
            id="email"
            etiqueta="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CampoFormulario
            id="especialidad"
            etiqueta="Especialidad"
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />

          <MensajeError mensaje={errors.general} />

          {successMessage && (
            <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '6px', textAlign: 'center', fontSize: '14px' }}>
              {successMessage}
            </div>
          )}
          <button type="submit" className="boton boton--primario boton--bloque" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Técnico'}
          </button>
        </form>
      </div>

      {showConfirmation && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#064789', margin: '0 0 10px 0' }}>¿Confirmar registro?</h3>
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
