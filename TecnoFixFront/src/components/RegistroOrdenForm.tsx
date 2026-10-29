import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../context/useAuth';
import { mostrarConfirmacion, mostrarExito, mostrarError } from '../utils/dialogo';

interface OptionType {
  value: string | number;
  label: string;
}

export default function RegistroOrdenForm() {
  const { token } = useAuth();

  // Estados de Opciones
  const [clientesOptions, setClientesOptions] = useState<OptionType[]>([]);
  const [marcasOptions, setMarcasOptions] = useState<OptionType[]>([]);
  const [modelosOptions, setModelosOptions] = useState<OptionType[]>([]);

  // Estados de Selección
  const [selectedCliente, setSelectedCliente] = useState<OptionType | null>(null);
  const [selectedMarca, setSelectedMarca] = useState<OptionType | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<OptionType | null>(null);

  // Estados de Formulario Completo
  const [formData, setFormData] = useState({
    tipoEquipo: '',
    marcaOtra: '',
    modeloOtro: '',
    numeroSerie: '',
    descripcionFalla: '',
    accesorios: ''
  });

  const [cargando, setCargando] = useState(false);

  // 1. Cargar Clientes (Carga funcional formateada como [RUT / Nombre])
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const respuesta = await fetch('http://localhost:5199/api/Auth/clientes', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!respuesta.ok) {
          console.error("Error al obtener clientes. Status:", respuesta.status);
          return;
        }

        const listaClientes: any[] = await respuesta.json();

        const opciones: OptionType[] = listaClientes.map((c: any) => {
          const clientId = c.id ?? c.ID ?? 0;
          const nombre = c.name ?? c.Name ?? 'Cliente sin nombre';
          const rutBruto = c.rut ?? c.RUT ?? 'Sin RUT';
          const rutLimpio = String(rutBruto).replace(/[^0-9kK]/g, '').toUpperCase();

          return {
            value: Number(clientId),
            label: `[${rutLimpio || 'SIN RUT'} / ${nombre}]`
          };
        }).filter(opcion => Number(opcion.value) > 0);

        setClientesOptions(opciones);

      } catch (error) {
        console.error('Error de red al cargar clientes:', error);
      }
    };

    if (token) cargarClientes();
  }, [token]);

  // 2. Cargar Marcas
  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const respuesta = await fetch('http://localhost:5199/api/Brand', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (respuesta.ok) {
          const data = await respuesta.json();
          const opciones: OptionType[] = data.map((m: any) => ({
            value: m.id ?? m.Id,
            label: m.name ?? m.Name ?? m.nombre
          }));
          opciones.push({ value: 'otra', label: '-- Otra marca (Ingresar manualmente) --' });
          setMarcasOptions(opciones);
        }
      } catch (error) {
        console.error('Error al cargar marcas:', error);
      }
    };

    if (token) cargarMarcas();
  }, [token]);

  // 3. Cargar Modelos al seleccionar una marca existente
  useEffect(() => {
    const cargarModelos = async () => {
      if (!selectedMarca || selectedMarca.value === 'otra') {
        setModelosOptions([]);
        setSelectedModelo(null);
        return;
      }

      try {
        const respuesta = await fetch(`http://localhost:5199/api/Brand/${selectedMarca.value}/models`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (respuesta.ok) {
          const data = await respuesta.json();
          const opciones: OptionType[] = data.map((mod: any) => ({
            value: mod.id ?? mod.Id,
            label: mod.name ?? mod.Name ?? mod.nombre
          }));
          opciones.push({ value: 'otro', label: '-- Otro modelo (Ingresar manualmente) --' });
          setModelosOptions(opciones);
        }
      } catch (error) {
        console.error('Error al cargar modelos:', error);
      }
    };

    cargarModelos();
  }, [selectedMarca, token]);

  // Validar si la marca ingresada manualmente ya existe en el listado
  const marcaExistenteCoincidencia = String(selectedMarca?.value) === 'otra' && formData.marcaOtra.trim() !== ''
    ? marcasOptions.find(m => 
        String(m.value) !== 'otra' && 
        m.label.trim().toLowerCase() === formData.marcaOtra.trim().toLowerCase()
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCliente || !formData.tipoEquipo || !selectedMarca || !formData.descripcionFalla) {
      mostrarError("Campos incompletos", "Por favor, completa todos los campos obligatorios (*)");
      return;
    }

    const confirmado = await mostrarConfirmacion({
      titulo: 'Confirmación de Orden (NF01)',
      mensaje: '¿Está seguro de registrar esta nueva orden en el sistema TecnoFix?',
      textoBotonConfirmar: 'Sí, registrar orden',
      textoBotonCancelar: 'Cancelar'
    });

    if (!confirmado) return;

    setCargando(true);

    const brandName = selectedMarca.value === 'otra' ? formData.marcaOtra : selectedMarca.label;
    const modelName = (selectedMarca.value === 'otra' || selectedModelo?.value === 'otro')
      ? formData.modeloOtro 
      : (selectedModelo?.label ?? null);

    const ordenPayload = {
      clientId: Number(selectedCliente.value),
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
        mostrarExito('¡Orden Registrada!', `La orden N° ${data.id ?? ''} ha sido creada exitosamente.`);

        setSelectedCliente(null);
        setSelectedMarca(null);
        setSelectedModelo(null);
        setFormData({
          tipoEquipo: '',
          marcaOtra: '',
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
      mostrarError('Error de red', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const customSelectStyles = {
    control: (styles: any) => ({
      ...styles,
      borderColor: 'var(--color-borde, #ccc)',
      borderRadius: '8px',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#0056b3' }
    })
  };

  return (
    <div style={{ background: 'var(--color-superficie, #fff)', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-borde, #ccc)', maxWidth: '900px', margin: '32px auto' }}>
      <h2>Registrar Orden de Reparación</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Autocompletado de Cliente */}
        <div className="campo">
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            Cliente (Buscar por RUT o Nombre) *
          </label>
          <Select
            options={clientesOptions}
            value={selectedCliente}
            onChange={(option) => setSelectedCliente(option)}
            placeholder="Buscar cliente ej: [21613092 / Juan Perez]..."
            noOptionsMessage={() => "No se encontraron clientes registrados"}
            isClearable
            isSearchable
            styles={customSelectStyles}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Selector Tipo de Equipo */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Tipo de Equipo *</label>
            <select
              value={formData.tipoEquipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipoEquipo: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
              required
            >
              <option value="">Seleccione tipo...</option>
              <option value="Notebook">Notebook</option>
              <option value="PC de Escritorio">PC de Escritorio</option>
              <option value="Celular">Celular</option>
              <option value="Tablet">Tablet</option>
              <option value="Consola">Consola</option>
              <option value="Impresora">Impresora</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Autocompletado de Marca */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Marca *</label>
            <Select
              options={marcasOptions}
              value={selectedMarca}
              onChange={(option) => setSelectedMarca(option)}
              placeholder="Buscar marca (ej: Samsung, Asus)..."
              isClearable
              isSearchable
              styles={customSelectStyles}
            />

            {selectedMarca?.value === 'otra' && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Especifique el nombre de la nueva marca..."
                  value={formData.marcaOtra}
                  onChange={(e) => setFormData(prev => ({ ...prev, marcaOtra: e.target.value }))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                  required
                />
                {marcaExistenteCoincidencia && (
                  <p style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '6px' }}>
                    La marca "{formData.marcaOtra}" ya existe en el sistema. Considere seleccionarla de la lista.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Autocompletado de Modelo */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Modelo</label>
            
            {/* Si elige "Otra marca", habilitamos directamente la entrada manual del modelo */}
            {selectedMarca?.value === 'otra' ? (
              <input
                type="text"
                placeholder="Especifique el modelo para esta nueva marca..."
                value={formData.modeloOtro}
                onChange={(e) => setFormData(prev => ({ ...prev, modeloOtro: e.target.value }))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            ) : (
              <>
                <Select
                  options={modelosOptions}
                  value={selectedModelo}
                  onChange={(option) => setSelectedModelo(option)}
                  placeholder={selectedMarca ? "Buscar modelo..." : "Primero elija una marca"}
                  isDisabled={!selectedMarca}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                />

                {selectedModelo?.value === 'otro' && (
                  <input
                    type="text"
                    placeholder="Especifique el modelo..."
                    value={formData.modeloOtro}
                    onChange={(e) => setFormData(prev => ({ ...prev, modeloOtro: e.target.value }))}
                    style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                )}
              </>
            )}
          </div>

          {/* Número de Serie */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Número de Serie (S/N)</label>
            <input
              type="text"
              placeholder="Ej: S/N 987654321"
              value={formData.numeroSerie}
              onChange={(e) => setFormData(prev => ({ ...prev, numeroSerie: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
            />
          </div>
        </div>

        {/* Descripción de la Falla */}
        <div className="campo">
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Descripción de la Falla *</label>
          <textarea
            value={formData.descripcionFalla}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcionFalla: e.target.value }))}
            style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
            placeholder="Describe el problema reportado..."
            required
          />
        </div>

        {/* Accesorios */}
        <div className="campo">
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Accesorios Dejados</label>
          <input
            type="text"
            placeholder="Ej: Cargador, funda, mouse..."
            value={formData.accesorios}
            onChange={(e) => setFormData(prev => ({ ...prev, accesorios: e.target.value }))}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          className="boton boton--primario" 
          style={{ 
            padding: '14px', 
            fontSize: '1.1rem',
            cursor: cargando ? 'not-allowed' : 'pointer',
            opacity: cargando ? 0.7 : 1 
          }}
        >
          {cargando ? 'Registrando...' : 'Registrar Orden'}
        </button>
      </form>
    </div>
  );
}