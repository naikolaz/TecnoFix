import api from '../config/api'
import type { ClientOrder } from '../interfaces/ClientOrder'

export const getMyOrders = async (): Promise<ClientOrder[]> => {
  const { data } = await api.get<ClientOrder[]>('/ClientOrder')
  return data
}

export const approveBudget = async (orderId: number): Promise<ClientOrder> => {
  const { data } = await api.post<ClientOrder>(`/ClientOrder/${orderId}/approve-budget`)
  return data
}

export const rejectBudget = async (orderId: number): Promise<ClientOrder> => {
  const { data } = await api.post<ClientOrder>(`/ClientOrder/${orderId}/reject-budget`)
  return data
}
