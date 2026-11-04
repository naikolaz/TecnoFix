export interface Brand {
  id: number;
  name: string;
}
export type Marca = Brand;

export interface DeviceModel {
  id: number;
  name: string;
}
export type ModeloDispositivo = DeviceModel;

export interface CreateOrderDto {
  clientId: number;
  deviceType: string;
  brand: string;
  model?: string;
  serialNumber?: string;
  issueDescription: string;
  accessories?: string;
}

export interface OrderResponseDto {
  id: number;
  clientId: number;
  clientName: string;
  clientEmail: string;
  deviceType: string;
  brandAndModel: string;
  serialNumber?: string;
  issueDescription: string;
  accessories?: string;
  status: string;
  createdAt: string;
}
