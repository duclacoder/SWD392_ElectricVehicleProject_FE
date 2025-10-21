export interface AdminVehicle {
  vehiclesId: number;
  userId: number;
  vehicleName: string;
  description: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  bodyType: string;
  batteryCapacity: number;
  rangeKm: number;
  chargingTimeHours: number;
  fastChargingSupport: boolean;
  motorPowerKw: number;
  topSpeedKph: number;
  acceleration: number;
  connectorType: string;
  year: number;
  km: number;
  batteryStatus: string;
  warrantyMonths: number;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  status: string;
}

export interface AdminVehicleFormData {
  vehicleName: string;
  description: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  bodyType: string;
  batteryCapacity: number;
  rangeKm: number;
  chargingTimeHours: number;
  fastChargingSupport: boolean;
  motorPowerKw: number;
  topSpeedKph: number;
  acceleration: number;
  connectorType: string;
  year: number;
  km: number;
  batteryStatus: string;
  warrantyMonths: number;
  price: number;
  currency: string;
}
