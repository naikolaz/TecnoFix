import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { mostrarConfirmacion, mostrarExito, mostrarError } from '../utils/dialogo';

interface Marca {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  nombre?: string;
}

interface Modelo {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  nombre?: string;
}

export default function RegistroOrdenForm() {
  const { token } = useAuth(); 
  
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const [formData, setFormData] = useState({
    idCliente: '',
    tipoEquipo: '',
    marcaId: '',
    marcaOtra: '',
    modeloId: '',
    modeloOtro: '',
    numeroSerie: '',
    descripcionFalla: '',
    accesorios: ''
  });

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const respuesta = await fetch('http://localhost:5199/api/Brand', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }); 
        if (respuesta.ok) {
          setMarcas(await respuesta.json());
        }
      } catch (error) {
        console.error('Error al cargar marcas:', error);
      }
    };
    if (token) cargarMarcas();
  }, [token]);

  useEffect(() => {
    const cargarModelos = async () => {
      if (!formData.marcaId || formData.marcaId === 'otra') {
        setModelos([]);
        if (formData.marcaId === 'otra') {
           setFormData(prev => ({ ...prev, modeloId: 'otro' }));
        }
        return;
      }
      
      try {
        const respuesta = await fetch(`http://localhost:5199/api/Brand/${formData.marcaId}/models`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }); 
        if (respuesta.ok) {
          setModelos(await respuesta.json());
        }
      } catch (error) {
        console.error('Error al cargar modelos:', error);
      }
    };
    
    cargarModelos();
  }, [formData.marcaId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // 1. Validaciones básicas del formulario
    if (!formData.idCliente || !formData.tipoEquipo || !formData.marcaId || !formData.descripcionFalla) {
      mostrarError("Campos incompletos", "Por favor, completa todos los campos obligatorios (*)");
      return;
    }

    const clientIdParsed = parseInt(formData.idCliente, 10);
    if (isNaN(clientIdParsed)) {
      mostrarError("ID Inválido", "El ID del cliente debe ser un número entero válido.");
      return;
    }

    // 2. Diálogo de confirmaciones visual (NF01 / SweetAlert2)
    const confirmado = await mostrarConfirmacion({
      titulo: 'Confirmación de Orden (NF01)',
      mensaje: '¿Está seguro de registrar esta nueva orden de trabajo en el sistema TecnoFix?',
      textoBotonConfirmar: 'Sí, registrar orden',
      textoBotonCancelar: 'Cancelar'
    });

    if (!confirmado) return;

    // 3. Preparación de nombres de Marca y Modelo
    let brandName = formData.marcaOtra;
    if (formData.marcaId !== 'otra') {
      const marcaEncontrada = marcas.find(m => String(m.id ?? m.Id) === String(formData.marcaId));
      brandName = marcaEncontrada?.name ?? marcaEncontrada?.Name ?? marcaEncontrada?.nombre ?? '';
    }

    let modelName = formData.modeloOtro;
    if (formData.modeloId && formData.modeloId !== 'otro') {
      const modeloEncontrado = modelos.find(m => String(m.id ?? m.Id) === String(formData.modeloId));
      modelName = modeloEncontrado?.name ?? modeloEncontrado?.Name ?? modeloEncontrado?.nombre ?? '';
    }

    const ordenPayload = {
      clientId: clientIdParsed,
      deviceType: formData.tipoEquipo,
      brand: brandName,
      model: modelName || null,
      serialNumber: formData.numeroSerie || null,
      issueDescription: formData.descripcionFalla,
      accessories: formData.accesorios || null
    };

    try {
      const respuesta = await fetch('http://localhost:5199/api/Order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ordenPayload)
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        
        mostrarExito('¡Orden Registrada!', `La orden N° ${data.id} ha sido creada exitosamente.`);
        
        setFormData({
          idCliente: '',
          tipoEquipo: '',
          marcaId: '',
          marcaOtra: '',
          modeloId: '',
          modeloOtro: '',
          numeroSerie: '',
          descripcionFalla: '',
          accesorios: ''
        });
      } else {
        const errorData = await respuesta.json().catch(() => null);
        mostrarError('Error del servidor', errorData?.message || 'No se pudo crear la orden.');
      }

    } catch (error) {
      console.error("Error de red:", error);
      mostrarError('Error de red', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <div style={{ background: 'var(--color-superficie)', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-borde)', maxWidth: '900px', margin: '32px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-borde)', paddingBottom: '16px' }}>
        <h2 style={{ color: 'var(--color-primario)', margin: '0 0 8px 0', fontSize: '1.8rem' }}>Registrar Orden de Reparación</h2>
        <p className="texto-suave" style={{ margin: 0 }}>Módulo ORD-001 - Taller Técnico</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="campo">
          <label>ID Cliente *</label>
          <div className="campo__control">
            <input name="idCliente" value={formData.idCliente} onChange={handleChange} type="text" placeholder="Ej: 1" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label>Tipo de Equipo *</label>
            <div className="campo__control">
              <select name="tipoEquipo" value={formData.tipoEquipo} onChange={handleChange} style={{ flex: 1, border: 'none', background: 'transparent', padding: '11px 12px', font: 'inherit', color: 'var(--color-texto)', outline: 'none', cursor: 'pointer' }}>
                <option value="">Seleccione tipo...</option>
                <option value="notebook">Notebook</option>
                <option value="pc">PC de Escritorio</option>
                <option value="Celular">Celular</option>
                <option value="tablet">Tablet</option>
                <option value="impresora">Impresora</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label>Marca *</label>
            <div className="campo__control" style={{ flexDirection: 'column', gap: '10px' }}>
              <select name="marcaId" value={formData.marcaId} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'transparent', padding: '11px 12px', font: 'inherit', color: 'var(--color-texto)', outline: 'none', cursor: 'pointer' }}>
                <option value="">Seleccione marca...</option>
                {marcas.map((marca: any) => (
                  <option key={marca.id ?? marca.Id} value={marca.id ?? marca.Id}>
                    {marca.name ?? marca.Name ?? marca.nombre}
                  </option>
                ))}
                <option value="otra">-- Otra marca --</option>
              </select>
              
              {formData.marcaId === 'otra' && (
                <div style={{ borderTop: '1px solid var(--color-borde)', paddingTop: '10px' }}>
                  <input name="marcaOtra" value={formData.marcaOtra} onChange={handleChange} type="text" placeholder="Especifique la marca..." style={{ width: '100%', border: 'none', outline: 'none', padding: '0 12px', background: 'transparent' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label>Modelo</label>
            <div className="campo__control" style={{ flexDirection: 'column', gap: '10px' }}>
              <select name="modeloId" value={formData.modeloId} onChange={handleChange} disabled={!formData.marcaId} style={{ width: '100%', border: 'none', background: 'transparent', padding: '11px 12px', font: 'inherit', color: 'var(--color-texto)', outline: 'none', cursor: formData.marcaId ? 'pointer' : 'not-allowed', opacity: formData.marcaId ? 1 : 0.6 }}>
                <option value="">{formData.marcaId ? "Seleccione modelo..." : "Primero elija una marca"}</option>
                {modelos.map((modelo: any) => (
                  <option key={modelo.id ?? modelo.Id} value={modelo.id ?? modelo.Id}>
                    {modelo.name ?? modelo.Name ?? modelo.nombre}
                  </option>
                ))}
                {formData.marcaId && <option value="otro">-- Otro modelo --</option>}
              </select>

              {formData.modeloId === 'otro' && (
                <div style={{ borderTop: '1px solid var(--color-borde)', paddingTop: '10px' }}>
                  <input name="modeloOtro" value={formData.modeloOtro} onChange={handleChange} type="text" placeholder="Especifique el modelo..." style={{ width: '100%', border: 'none', outline: 'none', padding: '0 12px', background: 'transparent' }} />
                </div>
              )}
            </div>
          </div>

          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label>Número de Serie (S/N)</label>
            <div className="campo__control">
              <input name="numeroSerie" value={formData.numeroSerie} onChange={handleChange} type="text" placeholder="Ej: S/N 987654321" />
            </div>
          </div>
        </div>

        <div className="campo">
          <label>Descripción de la Falla *</label>
          <div className="campo__control" style={{ padding: 0 }}>
            <textarea
              name="descripcionFalla" value={formData.descripcionFalla} onChange={handleChange}
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '11px 12px', font: 'inherit', color: 'var(--color-texto)', outline: 'none', resize: 'vertical', minHeight: '120px' }}
              placeholder="Describe detalladamente el problema reportado por el cliente..."
            ></textarea>
          </div>
        </div>

        <div className="campo">
          <label>Accesorios Dejados</label>
          <div className="campo__control">
            <input name="accesorios" value={formData.accesorios} onChange={handleChange} type="text" placeholder="Ej: Cargador original, funda negra, mouse inalámbrico..." />
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <button type="submit" className="boton boton--primario boton--bloque" style={{ padding: '14px', fontSize: '1.1rem' }}>
            Registrar Orden
          </button>
        </div>
      </form>
    </div>
  );
}