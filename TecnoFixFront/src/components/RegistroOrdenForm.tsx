import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../context/useAuth';
import { getClients } from '../services/authService';
import { getBrands, getModelsByBrand } from '../services/BrandServices';
import { createOrder } from '../services/orderService';
import { showConfirmationDialog, showSuccessDialog, showErrorDialog } from '../utils/dialogo';
import { getErrorMessage } from '../utils/errores';

interface OptionType {
  value: string | number;
  label: string;
}

interface OrderFormState {
  deviceType: string;
  customBrand: string;
  customModel: string;
  serialNumber: string;
  issueDescription: string;
  accessories: string;
}

interface OrderFormErrors {
  client?: string;
  deviceType?: string;
  brandAndModel?: string;
  issueDescription?: string;
}

export default function RegistroOrdenForm() {
  const { isAuthenticated } = useAuth();

  // Dropdown options
  const [clientsOptions, setClientsOptions] = useState<OptionType[]>([]);
  const [brandsOptions, setBrandsOptions] = useState<OptionType[]>([]);
  const [modelsOptions, setModelsOptions] = useState<OptionType[]>([]);

  // Selected values
  const [selectedClient, setSelectedClient] = useState<OptionType | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<OptionType | null>(null);
  const [selectedModel, setSelectedModel] = useState<OptionType | null>(null);

  // Form input data
  const [formData, setFormData] = useState<OrderFormState>({
    deviceType: '',
    customBrand: '',
    customModel: '',
    serialNumber: '',
    issueDescription: '',
    accessories: ''
  });

  const [fieldErrors, setFieldErrors] = useState<OrderFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientList = await getClients();

        const options: OptionType[] = clientList.map((client) => {
          const clientId = client.id ?? 0;
          const name = client.nombreCompleto ?? client.name ?? 'Cliente sin nombre';
          const rawRut = client.rut ?? 'Sin RUT';
          const cleanRut = String(rawRut).replace(/[^0-9kK]/g, '').toUpperCase();

          return {
            value: Number(clientId),
            label: `[${cleanRut || 'SIN RUT'} / ${name}]`
          };
        }).filter(option => Number(option.value) > 0);

        setClientsOptions(options);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };

    if (isAuthenticated) loadClients();
  }, [isAuthenticated]);

  // 2. Load brands
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await getBrands();
        const options: OptionType[] = brands.map((b) => ({
          value: b.id,
          label: b.name
        }));
        options.push({ value: 'otra', label: '-- Otra marca (Ingresar manualmente) --' });
        setBrandsOptions(options);
      } catch (error) {
        console.error('Error al cargar marcas:', error);
      }
    };

    if (isAuthenticated) loadBrands();
  }, [isAuthenticated]);

  // 3. Load models when brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (!selectedBrand || selectedBrand.value === 'otra') {
        setModelsOptions([]);
        setSelectedModel(null);
        return;
      }

      try {
        const models = await getModelsByBrand(selectedBrand.value);
        const options: OptionType[] = models.map((m) => ({
          value: m.id,
          label: m.name
        }));
        options.push({ value: 'otro', label: '-- Otro modelo (Ingresar manualmente) --' });
        setModelsOptions(options);
      } catch (error) {
        console.error('Error al cargar modelos:', error);
      }
    };

    loadModels();
  }, [selectedBrand]);

  // Check if manually entered brand already exists
  const matchingExistingBrand = String(selectedBrand?.value) === 'otra' && formData.customBrand.trim() !== ''
    ? brandsOptions.find(b => 
        String(b.value) !== 'otra' && 
        b.label.trim().toLowerCase() === formData.customBrand.trim().toLowerCase()
      )
    : null;

  // Validation function enforcing ORD-001: «Debe completar el campo <<indicar campo>>»
  const validateForm = (): boolean => {
    const errors: OrderFormErrors = {};

    if (!selectedClient) {
      errors.client = 'Debe completar el campo Cliente';
    }

    if (!formData.deviceType.trim()) {
      errors.deviceType = 'Debe completar el campo Tipo de equipo';
    }

    if (!selectedBrand || (selectedBrand.value === 'otra' && !formData.customBrand.trim())) {
      errors.brandAndModel = 'Debe completar el campo Marca y modelo';
    }

    if (!formData.issueDescription.trim()) {
      errors.issueDescription = 'Debe completar el campo Descripción de la falla';
    }

    setFieldErrors(errors);

    // Show explicit error popup with the first missing mandatory field
    const firstErrorMessage = errors.client 
      || errors.deviceType 
      || errors.brandAndModel 
      || errors.issueDescription;

    if (firstErrorMessage) {
      showErrorDialog('Validación requerida', firstErrorMessage);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const isConfirmed = await showConfirmationDialog({
      title: 'Confirmación de Orden (ORD-001)',
      message: '¿Está seguro de registrar esta nueva orden de reparación en el sistema TecnoFix?',
      confirmButtonText: 'Sí, registrar orden',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    setIsLoading(true);

    const brandName = selectedBrand?.value === 'otra' ? formData.customBrand.trim() : (selectedBrand?.label ?? '');
    const modelName = (selectedBrand?.value === 'otra' || selectedModel?.value === 'otro')
      ? formData.customModel.trim() 
      : (selectedModel?.label ?? '');

    const orderPayload = {
      clientId: Number(selectedClient?.value),
      deviceType: formData.deviceType.trim(),
      brand: brandName,
      model: modelName || undefined,
      serialNumber: formData.serialNumber.trim() || undefined,
      issueDescription: formData.issueDescription.trim(),
      accessories: formData.accessories.trim() || undefined
    };

    try {
      const createdOrder = await createOrder(orderPayload);
      showSuccessDialog(
        '¡Orden Registrada!', 
        `La orden N° ${createdOrder.id} ha sido registrada con estado «${createdOrder.status}». Fecha de recepción: ${new Date(createdOrder.createdAt).toLocaleString()}.`
      );

      // Reset form
      setSelectedClient(null);
      setSelectedBrand(null);
      setSelectedModel(null);
      setFieldErrors({});
      setFormData({
        deviceType: '',
        customBrand: '',
        customModel: '',
        serialNumber: '',
        issueDescription: '',
        accessories: ''
      });
    } catch (error) {
      const message = getErrorMessage(error);
      showErrorDialog('Error al registrar la orden', message);
    } finally {
      setIsLoading(false);
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
      <h2>Registrar Orden de Reparación (ORD-001)</h2>
      <p style={{ color: 'var(--color-texto-suave, #666)', marginBottom: '20px' }}>
        Complete los datos del equipo recibido. Los campos con (*) son obligatorios.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
        
        {/* Cliente */}
        <div className="campo">
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            Cliente (Seleccionar del listado) *
          </label>
          <Select
            options={clientsOptions}
            value={selectedClient}
            onChange={(option) => {
              setSelectedClient(option);
              setFieldErrors(prev => ({ ...prev, client: undefined }));
            }}
            placeholder="Buscar cliente ej: [21613092 / Juan Perez]..."
            noOptionsMessage={() => "No se encontraron clientes registrados"}
            isClearable
            isSearchable
            styles={customSelectStyles}
          />
          {fieldErrors.client && (
            <p style={{ color: '#f56558', fontSize: '0.85rem', marginTop: '4px' }}>
              {fieldErrors.client}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Tipo de Equipo */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Tipo de equipo *
            </label>
            <select
              value={formData.deviceType}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({ ...prev, deviceType: val }));
                setFieldErrors(prev => ({ ...prev, deviceType: undefined }));
              }}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '8px', 
                border: fieldErrors.deviceType ? '1.5px solid #f56558' : '1px solid var(--color-borde, #ccc)' 
              }}
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
            {fieldErrors.deviceType && (
              <p style={{ color: '#f56558', fontSize: '0.85rem', marginTop: '4px' }}>
                {fieldErrors.deviceType}
              </p>
            )}
          </div>

          {/* Marca */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Marca y modelo (Marca) *
            </label>
            <Select
              options={brandsOptions}
              value={selectedBrand}
              onChange={(option) => {
                setSelectedBrand(option);
                setFieldErrors(prev => ({ ...prev, brandAndModel: undefined }));
              }}
              placeholder="Buscar marca (ej: Samsung, Asus)..."
              isClearable
              isSearchable
              styles={customSelectStyles}
            />

            {selectedBrand?.value === 'otra' && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Especifique el nombre de la nueva marca..."
                  value={formData.customBrand}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, customBrand: val }));
                    setFieldErrors(prev => ({ ...prev, brandAndModel: undefined }));
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                {matchingExistingBrand && (
                  <p style={{ color: '#f56558', fontSize: '0.85rem', marginTop: '6px' }}>
                    La marca "{formData.customBrand}" ya existe en el sistema. Considere seleccionarla de la lista.
                  </p>
                )}
              </div>
            )}
            {fieldErrors.brandAndModel && (
              <p style={{ color: '#f56558', fontSize: '0.85rem', marginTop: '4px' }}>
                {fieldErrors.brandAndModel}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Modelo */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Modelo
            </label>
            
            {selectedBrand?.value === 'otra' ? (
              <input
                type="text"
                placeholder="Especifique el modelo para esta nueva marca..."
                value={formData.customModel}
                onChange={(e) => setFormData(prev => ({ ...prev, customModel: e.target.value }))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            ) : (
              <>
                <Select
                  options={modelsOptions}
                  value={selectedModel}
                  onChange={(option) => setSelectedModel(option)}
                  placeholder={selectedBrand ? "Buscar modelo..." : "Primero elija una marca"}
                  isDisabled={!selectedBrand}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                />

                {selectedModel?.value === 'otro' && (
                  <input
                    type="text"
                    placeholder="Especifique el modelo..."
                    value={formData.customModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, customModel: e.target.value }))}
                    style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                )}
              </>
            )}
          </div>

          {/* Número de Serie (opcional) */}
          <div className="campo" style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Número de serie (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: S/N 987654321"
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
            />
          </div>
        </div>

        {/* Descripción de la Falla reportada (obligatorio) */}
        <div className="campo">
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            Descripción de la falla reportada *
          </label>
          <textarea
            value={formData.issueDescription}
            onChange={(e) => {
              const val = e.target.value;
              setFormData(prev => ({ ...prev, issueDescription: val }));
              setFieldErrors(prev => ({ ...prev, issueDescription: undefined }));
            }}
            style={{ 
              width: '100%', 
              minHeight: '100px', 
              padding: '10px', 
              borderRadius: '8px', 
              border: fieldErrors.issueDescription ? '1.5px solid #f56558' : '1px solid var(--color-borde, #ccc)' 
            }}
            placeholder="Describe el problema reportado por el cliente..."
          />
          {fieldErrors.issueDescription && (
            <p style={{ color: '#f56558', fontSize: '0.85rem', marginTop: '4px' }}>
              {fieldErrors.issueDescription}
            </p>
          )}
        </div>

        {/* Accesorios entregados (opcional) */}
        <div className="campo">
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            Accesorios entregados (opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Cargador original, funda, adaptador..."
            value={formData.accessories}
            onChange={(e) => setFormData(prev => ({ ...prev, accessories: e.target.value }))}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
          />
        </div>

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
          {isLoading ? 'Registrando orden...' : 'Registrar orden de reparación'}
        </button>
      </form>
    </div>
  );
}
