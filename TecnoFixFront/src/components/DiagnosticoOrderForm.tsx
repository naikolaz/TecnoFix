import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../context/useAuth';
import { getOrdersForDiagnosis, startDiagnosis, saveDiagnosisAndBudget } from '../services/orderService';
import { showConfirmationDialog, showSuccessDialog, showErrorDialog } from '../utils/dialogo';
import { getErrorMessage } from '../utils/errores';

interface OptionType {
  value: number;
  label: string;
  order: any; // Guardamos la orden completa para mostrar detalles
}

interface DiagnosisFormState {
  technicalDiagnosis: string;
  laborCost: string;
  partsCost: string;
}

export default function DiagnosticoOrderForm() {
  const { isAuthenticated } = useAuth();
  
  const [ordersOptions, setOrdersOptions] = useState<OptionType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OptionType | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  
  const [formData, setFormData] = useState<DiagnosisFormState>({
    technicalDiagnosis: '',
    laborCost: '',
    partsCost: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Cargar órdenes válidas ("Recibida" o "En diagnóstico")
  const loadOrders = async () => {
    try {
      const orders = await getOrdersForDiagnosis();
      const options: OptionType[] = orders.map((o: any) => ({
        value: o.id,
        label: `Orden N°${o.id} - ${o.deviceType} ${o.brandAndModel} [Estado: ${o.status}]`,
        order: o
      }));
      setOrdersOptions(options);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadOrders();
  }, [isAuthenticated]);

  // Manejar la apertura de la orden (cambia a "En diagnóstico")
  const handleStartDiagnosis = async () => {
    if (!selectedOrder) return;

    try {
      setIsLoading(true);
      if (selectedOrder.order.status === 'Recibida') {
        await startDiagnosis(selectedOrder.value);
      }
      setIsDiagnosing(true);
      showSuccessDialog('Diagnóstico Iniciado', `La orden N°${selectedOrder.value} ahora está en diagnóstico.`);
    } catch (error) {
      showErrorDialog('Error', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Validaciones del ODR-002
  const validateForm = (): boolean => {
    if (!formData.technicalDiagnosis.trim()) {
      showErrorDialog('Validación requerida', 'Debe completar el campo Diagnóstico técnico');
      return false;
    }
    
    const labor = parseFloat(formData.laborCost);
    const parts = parseFloat(formData.partsCost);

    if (formData.laborCost.trim() === '' || isNaN(labor) || labor < 0) {
      showErrorDialog('Validación requerida', 'El costo ingresado no es válido (Mano de obra)');
      return false;
    }

    if (formData.partsCost.trim() === '' || isNaN(parts) || parts < 0) {
      showErrorDialog('Validación requerida', 'El costo ingresado no es válido (Repuestos)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedOrder) return;

    const totalCost = parseFloat(formData.laborCost) + parseFloat(formData.partsCost);

    const isConfirmed = await showConfirmationDialog({
      title: 'Confirmar Presupuesto',
      message: `El costo total calculado (IVA incluido) es $${totalCost}. ¿Desea registrar este presupuesto y cambiar el estado a «Presupuestada»?`,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    setIsLoading(true);

    try {
      const payload = {
        technicalDiagnosis: formData.technicalDiagnosis.trim(),
        laborCost: parseFloat(formData.laborCost),
        partsCost: parseFloat(formData.partsCost)
      };

      await saveDiagnosisAndBudget(selectedOrder.value, payload);
      
      showSuccessDialog(
        '¡Presupuesto Registrado!', 
        `La orden N° ${selectedOrder.value} ha sido presupuestada exitosamente.`
      );

      // Limpiar formulario y recargar órdenes
      setSelectedOrder(null);
      setIsDiagnosing(false);
      setFormData({ technicalDiagnosis: '', laborCost: '', partsCost: '' });
      loadOrders();

    } catch (error) {
      showErrorDialog('Error al registrar', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Cálculo en tiempo real
  const currentTotal = (parseFloat(formData.laborCost) || 0) + (parseFloat(formData.partsCost) || 0);

  return (
    <div style={{ position: 'relative', background: 'var(--color-superficie, #fff)', borderRadius: '14px', boxShadow: '0 10px 30px rgba(6, 71, 137, 0.12)', maxWidth: '900px', margin: '32px auto', overflow: 'hidden' }}>
      
      {/* Borde superior con degradado */}
      <div style={{ height: '6px', width: '100%', background: 'linear-gradient(160deg, var(--color-primario, #064789) 0%, var(--color-secundario, #2563eb) 100%)' }} />
      
      <div style={{ padding: '32px 36px' }}>
        {/* Título en azul */}
        <h2 style={{ color: 'var(--color-primario, #064789)', margin: '0 0 8px 0', fontSize: '1.6rem' }}>Registrar Diagnóstico y Presupuesto</h2>
        
        {!isDiagnosing ? (
          <div style={{ marginBottom: '20px', marginTop: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Seleccionar Orden (Recibida o En diagnóstico) *
            </label>
            <Select
              options={ordersOptions}
              value={selectedOrder}
              onChange={(option) => setSelectedOrder(option)}
              placeholder="Buscar orden por número o modelo..."
              noOptionsMessage={() => "No hay órdenes pendientes de diagnóstico"}
              isClearable
              isSearchable
            />
            <button 
              onClick={handleStartDiagnosis}
              disabled={!selectedOrder || isLoading}
              className="boton boton--primario"
              style={{ marginTop: '20px', padding: '12px', width: '100%', cursor: (!selectedOrder || isLoading) ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? 'Cargando...' : 'Abrir Orden para Diagnosticar'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }} noValidate>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <strong>Orden seleccionada:</strong> {selectedOrder?.label} <br/>
              <strong>Falla reportada:</strong> {selectedOrder?.order.issueDescription}
            </div>

            <div className="campo">
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                Diagnóstico técnico *
              </label>
              <textarea
                value={formData.technicalDiagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, technicalDiagnosis: e.target.value }))}
                style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-borde, #ccc)' }}
                placeholder="Describa el diagnóstico realizado..."
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="campo" style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                  Costo mano de obra ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.laborCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, laborCost: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div className="campo" style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                  Costo repuestos ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.partsCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, partsCost: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div className="campo" style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#0056b3' }}>
                  Costo Total (Valores finales)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`$ ${currentTotal.toLocaleString('es-CL')}`}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0056b3', backgroundColor: '#e9f2fb', fontWeight: 'bold' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsDiagnosing(false);
                  setSelectedOrder(null);
                }}
                className="boton boton--secundario"
                style={{ padding: '14px', flex: '1' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="boton boton--primario" 
                style={{ padding: '14px', flex: '2', cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? 'Guardando...' : 'Registrar Presupuesto'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}