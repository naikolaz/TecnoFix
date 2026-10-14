import { useState } from 'react';
import { registrarTecnico } from '../services/authService';
import CampoFormulario from '../components/CampoFormulario';
import MensajeError from '../components/MensajeError';
import './LoginPage.css';


export const RegistrarTecnicoPage = () => {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [errores, setErrores] = useState({ nombre: '', general: '' });
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        setMensajeExito('');
        e.preventDefault();
        setErrores({ nombre: '', general: '' });

        if (!nombreCompleto.trim()) return setErrores(prev => ({ ...prev, general: 'Debe completar el campo Nombre Completo' }));
        if (!email.trim()) return setErrores(prev => ({ ...prev, general: 'Debe completar el campo Correo Electrónico' }));
        if (!especialidad.trim()) return setErrores(prev => ({ ...prev, general: 'Debe completar el campo Especialidad' }));

        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(nombreCompleto)) {
            setErrores(prev => ({ ...prev, nombre: 'El nombre solo puede contener letras y espacios' }));
            return;
        }

        if (!window.confirm('¿Está seguro?')) return;

        setCargando(true);
        try {
            await registrarTecnico({ nombreCompleto, email, especialidad });
            setMensajeExito('Técnico registrado exitosamente.');
            setNombreCompleto(''); setEmail(''); setEspecialidad('');
        } catch (error: any) {
            setErrores(prev => ({ ...prev, general: error.message }));
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login">
            <div className="login__panel" style={{ width: '100%' }}>
                <form className="login__tarjeta" onSubmit={handleSubmit} noValidate style={{ margin: '0 auto' }}>
                    <h2>Registrar Nuevo Técnico</h2>
                    <p className="login__subtitulo">Ingresa los datos para añadir un técnico al sistema.</p>

                    <CampoFormulario
                        id="nombre" etiqueta="Nombre Completo" type="text"
                        value={nombreCompleto} error={errores.nombre}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                    <CampoFormulario
                        id="email" etiqueta="Correo Electrónico" type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <CampoFormulario
                        id="especialidad" etiqueta="Especialidad" type="text"
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                    />

                    <MensajeError mensaje={errores.general} />



                    <MensajeError mensaje={errores.general} />
                    {mensajeExito && (
                        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '6px', textAlign: 'center', fontSize: '14px' }}>
                            {mensajeExito}
                        </div>
                    )}
                    <button type="submit" className="boton boton--primario boton--bloque" disabled={cargando}>
                            {cargando ? 'Registrando...' : 'Registrar Técnico'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default RegistrarTecnicoPage;