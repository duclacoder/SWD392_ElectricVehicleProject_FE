import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import type { JwtTokenDecode } from "../../entities/Decode";
import type { GoogleLoginForm, LoginForm } from "../../entities/Form";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const Login = async (LoginForm: LoginForm): Promise<boolean> => {
  try {
    const response = await api.post("Auth/Login", LoginForm);
    const data: ResponseDTO<string> = response.data;
    if (data.isSuccess) {
      const token = data.result;
      const userData = jwtDecode<JwtTokenDecode>(token);
      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("imageUrl", userData.imageUrl);
    } else {
      message.error(data.message);
    }
    return data.isSuccess;
  } catch (error: any) {
    message.error(error?.response?.data?.message || "Login failed");
    console.error(error?.response?.data);
    return false;
  }
};

export const LoginGoogle = async (loginData: GoogleLoginForm): Promise<boolean> => {
  try {
    const response = await api.post(`Auth/Login-Google?tokenId=${loginData.tokenId}`, {
      password: loginData.password,
      confirmPassword: loginData.confirmPassword
    });
    console.log(response);
    const data: ResponseDTO<string> = response.data;
    if (data.isSuccess) {
      if (data.result) {
        console.log(data.result);
        const token = data.result.token;
        const userData = jwtDecode<JwtTokenDecode>(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("imageUrl", userData.imageUrl);
        return true;
      } else return false;
    } else {
      message.error(data.message);
    }
    return data.isSuccess;
  } catch (error: any) {
    message.error(error?.response?.data?.message || "Login failed");
    console.error(error?.response?.data);
    return false;
  }
};
