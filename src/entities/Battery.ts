export interface BatteryPostDTO {
  batteryName?: string;
  brand?: string;
  description?: string;
  capacity?: number;
  voltage?: number;
  warrantyMonths?: number;
  price?: number;
  currency?: string;
}

export interface BatteryUserPost {
  batteryId?: number;
  batteryName?: string;
  brand?: string;
  description?: string;
  capacity: number;
  voltage: number;
  warrantyMonths: number;
  price: number;
  currency?: string;
  createdAt: string;
  status: string;
}