import type { BatteryPostDTO, BatteryUserPost } from "./Battery";
import type { VehiclePostDTO, VehicleUserPost } from "./Vehicle";

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

export interface GetAllUserPostRequestDTO {
  page: number;
  pageSize: number;
  userId?: number;
  isVehiclePost?: boolean;
}
