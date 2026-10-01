import { useState } from 'react';
import { registrarTecnico } from '../services/authService';

export const RegistrarTecnicoPage = () => {
    // Estados para los campos del formulario
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    
    // Estados para los mensajes de error
    const [errores, setErrores] = useState({ nombre: '', general: '' });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({ nombre: '', general: '' }); // Limpiamos errores previos

    if (!nombreCompleto.trim()) {
        setErrores(prev => ({ ...prev, general: 'Debe completar el campo Nombre Completo' }));
        return;
    }
    if (!email.trim()) {
        setErrores(prev => ({ ...prev, general: 'Debe completar el campo Correo Electrónico' }));
        return;
    }
    if (!especialidad.trim()) {
        setErrores(prev => ({ ...prev, general: 'Debe completar el campo Especialidad' }));
        return;
    }

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexNombre.test(nombreCompleto)) {
        setErrores(prev => ({ ...prev, nombre: 'El nombre solo puede contener letras y espacios' }));
        return;
    }

    if (!window.confirm('¿Está seguro?')) return;

    try {
        await registrarTecnico({ nombreCompleto, email, especialidad });
        alert('Técnico registrado exitosamente.');
        
        // Limpiar el formulario tras el éxito
        setNombreCompleto('');
        setEmail('');
        setEspecialidad('');
    } catch (error: any) {
        setErrores(prev => ({ ...prev, general: error.message }));
    }
};

    // Requerimiento NF01: Estilo de error obligatorio
   // ... (mantén tus estados y la función handleSubmit igual) ...

    // Requerimiento NF01: Estilo de error obligatorio
    const estiloError = { color: '#f56558', fontSize: '14px', display: 'block', marginTop: '5px' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ color: '#002e5f', textAlign: 'center', marginBottom: '20px' }}>Registrar Nuevo Técnico</h2>
                
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Nombre Completo:</label>
                        <input 
                            type="text" 
                            value={nombreCompleto} 
                            onChange={(e) => setNombreCompleto(e.target.value)} 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        {errores.nombre && <span style={estiloError}>{errores.nombre}</span>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Correo Electrónico:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Especialidad:</label>
                        <input 
                            type="text" 
                            value={especialidad} 
                            onChange={(e) => setEspecialidad(e.target.value)} 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ 
                            padding: '10px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginTop: '10px'
                        }}
                    >
                        Registrar Técnico
                    </button>
                    
                    {errores.general && <div style={{ ...estiloError, textAlign: 'center' }}>{errores.general}</div>}
                </form>
            </div>
        </div>
    );
};
export default RegistrarTecnicoPage;