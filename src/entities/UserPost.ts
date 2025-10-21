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
  userName: string;
  packageName: string;
  title: string;
  description: string;
  vehicle?: VehiclePostDTO;
  imageUrls?: string[];
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
  userPostsId?: number;
  userName: string;
  title: string;
  description: string;
  vehicle?: VehicleUserPost;
  images?: string[];
  createdAt: string;
  status: string;
}

export interface GetAllUserPostRequestDTO {
  page: number;
  pageSize: number;
  userName?: string;
}
