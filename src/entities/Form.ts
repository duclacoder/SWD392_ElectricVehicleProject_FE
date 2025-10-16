export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterGoogleForm {
  tokenId: string;
  password: string;
  confirmPassword: string;
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

export interface GoogleLoginForm {
  tokenId: string;
  password: string;
  confirmPassword: string;
}
