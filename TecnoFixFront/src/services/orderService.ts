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
