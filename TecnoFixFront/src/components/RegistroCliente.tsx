import { useState } from 'react';

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

  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensajeExito(null);

    // Rúbrica: Confirmación antes de enviar
    const confirmado = window.confirm("¿Está seguro?");
    if (!confirmado) return;

    try {
      const response = await fetch('http://localhost:5199/api/auth/registrar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMensajeExito("Cliente registrado exitosamente. La contraseña fue enviada al correo.");
        setFormData({ nombreCompleto: '', email: '', rut: '', telefono: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.title || "Ocurrió un error al registrar.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor. ¿Está encendido el backend?");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Registro de Nuevo Cliente</h2>
      
      {/* Rúbrica: Mensajes de error en color hexadecimal #f56558 */}
      {error && <p style={{ color: '#f56558', fontWeight: 'bold' }}>{error}</p>}
      {mensajeExito && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensajeExito}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nombre Completo:</label>
          <input 
            type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required 
            title="Ingrese sus nombres y apellidos completos" // Rúbrica: Tooltips de ayuda
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Correo Electrónico:</label>
          <input 
            type="email" name="email" value={formData.email} onChange={handleChange} required 
            title="Debe contener un @ y un dominio válido"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>RUT:</label>
          <input 
            type="text" name="rut" value={formData.rut} onChange={handleChange} required 
            title="Ingrese sin puntos ni guion (Ej: 123456789)"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Teléfono:</label>
          <input 
            type="text" name="telefono" value={formData.telefono} onChange={handleChange} required 
            title="Ingrese su número con código de país (Ej: +56912345678)"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrar Cliente
        </button>
      </form>
    </div>
  );
}