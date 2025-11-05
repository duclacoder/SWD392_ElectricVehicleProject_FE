export interface User {
  usersId: string;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  imageUrl: string;
  roleId: number;
  roleName: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  token: string;
}

export interface UserPackage {
  id: number;
  user_id: number;
  package_id: number;
  purchased_duration: number;
  purchased_at_price: number;
  currency: string;
  purchased_at: string;
  status: string;
}

export interface UserVehicle {
  vehiclesId: number;
  vehicleName: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  price?: number;
  bodyType?: string;
  rangeKm?: number;
  motorPowerKw?: number;
  imageUrl?: string;
  km?: number;
  seats?: number;
  status?: string;
}

export interface UserBattery {
  batteriesId: number;
  batteryName: string;
  brand: string;
  capacity: number; // Ah
  voltage: number; // V
  price: number;
  description: string;
  warrantyMonths: number;
  status: string;
  imageUrl?: string;
}
