export interface VehiclePostDTO {
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  price?: number;
  description?: string;
  bodyType?: string;
  rangeKm?: number;
  motorPowerKw?: number;
}

export interface CreateUserPostDTO {
  userId: number;
  userPackageId: number;
  title: string;
  description: string;
  vehicle?: VehiclePostDTO;
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

export interface UserPostCustom {
  userPostId?: number;
  userName: string;
  title: string;
  description: string | null;
  vehicle?: VehicleUserPost;
  images?: string[];
  createdAt: string;
  status: string;
}

export interface GetAllUserPostRequestDTO {
  page: number;
  pageSize: number;
  userId?: number;
}
