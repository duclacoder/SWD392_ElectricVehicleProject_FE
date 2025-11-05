import type { BatteryPostDTO, BatteryUserPost } from "./Battery";
import type { VehiclePostDTO } from "./Vehicle";

export interface CreateUserPostDTO {
  userId: number;
  userPackageId: number;
  title: string;
  description: string;
  vehicle?: VehiclePostDTO;
  battery?: BatteryPostDTO;
}
export interface UserPostCustom {
  userPostId?: number;
  userName: string;
  title: string;
  description: string | null;
  vehicle?: VehicleUserPost;
  battery?: BatteryUserPost; 
  images?: string[];
  createdAt: string;
  status: string;
}

export interface VehicleUserPost {
  vehicleId?: number;
  brand?: string;
  model?: string;
  color?: string;
  year: number;
  price: number;
  description?: string;
  bodyType?: string;
  rangeKm: number;
  motorPowerKw: number;
  createdAt: string;
  status: string;
}


export interface GetAllUserPostRequestDTO {
  page: number;
  pageSize: number;
  userId?: number;
  isVehiclePost?: boolean;
}

export type CreateVehiclePostDTOWithId = CreateUserPostDTO & {
  vehicleId?: number;
};

export type CreateBatteryPostDTOWithId = Omit<CreateUserPostDTO, 'vehicle'> & {
  batteryId?: number;
  battery: BatteryPostDTO
};

