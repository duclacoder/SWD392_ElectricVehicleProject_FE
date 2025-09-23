export interface User {
  usersId: string;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  imageUrl: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  token: string;
}

export interface Role {
  rolesId: number;
  name: string;
}
