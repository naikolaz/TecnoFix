import type { CreateOrderDto, OrderResponseDto } from '../interfaces/Order';

const API_URL = 'http://localhost:5199/api/Order';

export const crearOrden = async (dto: CreateOrderDto): Promise<OrderResponseDto> => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al registrar la orden');
  }

  return res.json();
};