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
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensajeExito('');
        setErrores({ nombre: '', general: '' });

        if (!nombreCompleto.trim()) return setErrores(prev => ({ ...prev, general: 'Debe completar el campo Nombre Completo' }));
        if (!email.trim()) return setErrores(prev => ({ ...prev, general: 'Debe completar el campo Correo Electrónico' }));
        if (!especialidad.trim()) return setErrores(prev => ({ ...prev, general: 'Debe completar el campo Especialidad' }));

        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(nombreCompleto)) {
            setErrores(prev => ({ ...prev, nombre: 'El nombre solo puede contener letras y espacios' }));
            return;
        }
        setMostrarConfirmacion(true);
    };

        const ejecutarRegistro = async () => {
            setMostrarConfirmacion(false);
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

            {mostrarConfirmacion && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ color: '#064789', margin: '0 0 10px 0' }}>¿Confirmar registro?</h3>
                        <p style={{ color: '#555', marginBottom: '24px' }}>¿Estás seguro de que deseas registrar a este técnico en el sistema?</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button type="button" onClick={() => setMostrarConfirmacion(false)} style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                Cancelar
                            </button>
                            <button type="button" onClick={ejecutarRegistro} className="boton boton--primario">
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
