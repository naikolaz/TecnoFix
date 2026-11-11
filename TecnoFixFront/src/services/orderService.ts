import api from '../config/api';
import type { CreateOrderDto, OrderResponseDto } from '../interfaces/Order';

export const createOrder = async (dto: CreateOrderDto): Promise<OrderResponseDto> => {
  const { data } = await api.post<OrderResponseDto>('/Order', dto);
  return data;
};

export const getAllOrders = async (): Promise<OrderResponseDto[]> => {
  const { data } = await api.get<OrderResponseDto[]>('/Order');
  return data;
};

export const getOrderById = async (id: number): Promise<OrderResponseDto> => {
  const { data } = await api.get<OrderResponseDto>(`/Order/${id}`);
  return data;
};

export const getOrdersByClientId = async (clientId: number): Promise<OrderResponseDto[]> => {
  const { data } = await api.get<OrderResponseDto[]>(`/Order/cliente/${clientId}`);
  return data;
};

// Aliases
export const crearOrden = createOrder;
export const obtenerOrdenes = getAllOrders;
export const obtenerOrdenPorId = getOrderById;
export const obtenerOrdenesPorCliente = getOrdersByClientId;

export interface UpdateDiagnosisDto {
  technicalDiagnosis: string;
  laborCost: number;
  partsCost: number;
}

export const getOrdersForDiagnosis = async () => {
  // Usamos el endpoint base de órdenes y filtramos en el frontend
  const response = await api.get('/Order');
  const allOrders = response.data;
  return allOrders.filter((o: any) => o.status === 'Recibida' || o.status === 'En diagnóstico');
};

export const startDiagnosis = async (id: number): Promise<void> => {
  await api.put(`/Order/${id}/start-diagnosis`);
};

export const saveDiagnosisAndBudget = async (id: number, data: UpdateDiagnosisDto) => {
  const response = await api.put(`/Order/${id}/diagnosis`, data);
  return response.data;
};
