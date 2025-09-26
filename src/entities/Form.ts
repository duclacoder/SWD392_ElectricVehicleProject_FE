export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  userName: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
}

export interface UserFormData {
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  roleId: number;
  status?: boolean;
}
