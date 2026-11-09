import api from '../config/api';
import type { Brand, DeviceModel, Marca, ModeloDispositivo } from '../interfaces/Order';

export const getBrands = async (): Promise<Brand[]> => {
  const { data } = await api.get<Brand[]>('/Brand');
  return data;
};

export const getModelsByBrand = async (brandId: string | number): Promise<DeviceModel[]> => {
  const { data } = await api.get<DeviceModel[]>(`/Brand/${brandId}/models`);
  return data;
};

// Aliases
export const obtenerMarcas = getBrands;
export const obtenerModelosPorMarca = getModelsByBrand;
export type { Marca, ModeloDispositivo };
