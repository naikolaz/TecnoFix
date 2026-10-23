import type { Marca, ModeloDispositivo } from '../interfaces/Order';

const API_URL = 'http://localhost:5199/api/Brand';

export const obtenerMarcas = async (): Promise<Marca[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener marcas');
  return res.json();
};

export const obtenerModelosPorMarca = async (brandId: string): Promise<ModeloDispositivo[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${brandId}/models`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener modelos');
  return res.json();
};