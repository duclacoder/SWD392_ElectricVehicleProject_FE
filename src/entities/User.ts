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
