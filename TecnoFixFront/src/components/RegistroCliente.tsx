import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { obtenerMensajeError } from '../utils/errores';

interface FormularioRegistro {
  nombreCompleto: string;
  email: string;
  rut: string;
  telefono: string;
}

export default function RegistroCliente() {
  const [formData, setFormData] = useState<FormularioRegistro>({
    nombreCompleto: '',
    email: '',
    rut: '',
    telefono: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<FormularioRegistro>>({});
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errors: Partial<FormularioRegistro> = {};
    
    if (!formData.nombreCompleto.trim()) {
      errors.nombreCompleto = 'Debe completar el campo Nombre y apellidos';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Debe completar el campo Correo electrónico';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El correo electrónico no tiene un formato válido';
    }
    
    if (!formData.rut.trim()) {
      errors.rut = 'Debe completar el campo RUT';
    } else if (formData.rut.includes('.') || formData.rut.includes('-')) {
      errors.rut = 'El RUT debe ingresarse sin puntos ni guion (ej.: 12345670K)';
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = 'Debe completar el campo Teléfono de contacto';
    } else if (!/^\+569\d{8}$/.test(formData.telefono)) {
      errors.telefono = 'El teléfono debe tener el formato chileno de 11 dígitos (+569 seguido de 8 dígitos)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setError(null);
    setMensajeExito(false);
    if (!validate()) return;
    if (!window.confirm('¿Está seguro de registrar este cliente?')) return;

    setLoading(true);
    try {
      await api.post('/auth/registrar-cliente', formData);
      setMensajeExito(true);
      setFormData({ nombreCompleto: '', email: '', rut: '', telefono: '' });
    } catch (e: any) {
      setError(obtenerMensajeError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Panel izquierdo */}
      <div style={styles.panelLeft}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <span style={styles.brandName}>Tecno<span style={{ fontWeight: 300 }}>Fix</span></span>
        </div>

        <h1 style={styles.heroHeadline}>Crea tu cuenta<br />en segundos</h1>
        <p style={styles.heroSub}>
          Registra tus equipos, revisa el estado de tus reparaciones y recibe notificaciones en cada etapa del servicio.
        </p>

        <ul style={styles.featureList}>
          {[
            'Registro de equipos e historial',
            'Seguimiento en tiempo real',
            'Notificaciones por correo',
          ].map((item) => (
            <li key={item} style={styles.featureItem}>
              <div style={styles.featureDot} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho */}
      <div style={styles.panelRight}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Registro de cliente</h2>
          <p style={styles.cardSub}>Completa los datos para crear tu cuenta.</p>

          {/* Alerta error global */}
          {error && (
            <div style={{ ...styles.alert, ...styles.alertError }}>
              <span style={{ color: '#f56558', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Alerta éxito */}
          {mensajeExito && (
            <div style={{ ...styles.alert, ...styles.alertSuccess }}>
              <span>Cliente registrado. La contraseña fue enviada al correo electrónico.</span>
            </div>
          )}

          {/* Campo nombre */}
          <Field
            label="Nombre completo"
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            placeholder="Juan Pérez González"
            value={formData.nombreCompleto}
            onChange={handleChange}
            error={fieldErrors.nombreCompleto}
            tooltip="Ingresa nombres y apellidos completos"
          />

          {/* Campo email */}
          <Field
            label="Correo electrónico"
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            tooltip="Debe contener @ y dominio válido"
          />

          {/* Campo RUT */}
          <Field
            label="RUT"
            id="rut"
            name="rut"
            type="text"
            placeholder="12345670K"
            value={formData.rut}
            onChange={handleChange}
            error={fieldErrors.rut}
            tooltip="Sin puntos ni guion (ej.: 12345670K)"
          />

          {/* Campo teléfono */}
          <Field
            label="Teléfono"
            id="telefono"
            name="telefono"
            type="text"
            placeholder="+56912345678"
            value={formData.telefono}
            onChange={handleChange}
            error={fieldErrors.telefono}
            tooltip="Formato chileno: 11 dígitos (+569XXXXXXXX)"
            maxLength={11}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...styles.btnPrimary, opacity: loading ? 0.75 : 1 }}
          >
            {loading ? 'Registrando...' : 'Registrar cliente'}
          </button>

          <p style={styles.cardFooter}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={styles.link}>Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponente Field ──────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  tooltip?: string;
  maxLength?: number;
}

function Field({ label, id, name, type, placeholder, value, onChange, error, tooltip, maxLength }: FieldProps) {
  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          maxLength={maxLength}
          title={tooltip}
          style={{
            ...styles.input,
            borderColor: error ? '#f56558' : '#c7d8f5',
            background: error ? '#fff8f7' : '#f7f9fe',
          }}
        />
        {tooltip && (
          <span title={tooltip} style={styles.tooltipIcon}>?</span>
        )}
      </div>
      {error && <p style={styles.fieldError}>{error}</p>}
    </div>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    background: '#f0f4fb',
  },
  panelLeft: {
    width: '45%',
    minHeight: '100vh',
    background: 'linear-gradient(155deg, #1a3a6b 0%, #1e4fa8 60%, #2563eb 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem 3.5rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: '3rem',
  },
  brandIcon: {
    width: 48, height: 48,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 600,
    color: 'white',
    letterSpacing: '-0.3px',
  },
  heroHeadline: {
    fontSize: '2.1rem',
    fontWeight: 700,
    color: 'white',
    lineHeight: 1.2,
    marginBottom: '1.2rem',
    letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.6,
    maxWidth: 320,
    marginBottom: '2.5rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.9rem',
  },
  featureDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.5)',
    flexShrink: 0,
  },
  panelRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: 16,
    padding: '2.5rem 2.25rem',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 4px 24px rgba(30,79,168,0.10), 0 1px 4px rgba(30,79,168,0.06)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a3a6b',
    letterSpacing: '-0.4px',
    marginBottom: 6,
  },
  cardSub: {
    fontSize: '0.9rem',
    color: '#6b7a99',
    marginBottom: '1.75rem',
  },
  alert: {
    borderRadius: 9,
    padding: '10px 14px',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
  },
  alertError: {
    background: '#fff2f1',
    border: '1px solid #fccac5',
  },
  alertSuccess: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
  },
  field: {
    marginBottom: '1.1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#374a7a',
    marginBottom: 6,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px 36px 10px 12px',
    border: '1.5px solid #c7d8f5',
    borderRadius: 10,
    fontSize: '0.9rem',
    color: '#1e2a4a',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.18s',
  },
  tooltipIcon: {
    position: 'absolute',
    right: 10,
    width: 18, height: 18,
    background: '#c7d8f5',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: '#1e4fa8',
    cursor: 'help',
    userSelect: 'none',
  },
  fieldError: {
    fontSize: '0.78rem',
    color: '#f56558',
    marginTop: 4,
    marginBottom: 0,
  },
  btnPrimary: {
    width: '100%',
    padding: '13px',
    background: '#1a3a6b',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontFamily: 'inherit',
    transition: 'background 0.18s',
  },
  cardFooter: {
    textAlign: 'center',
    marginTop: '1.4rem',
    fontSize: '0.85rem',
    color: '#6b7a99',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
};